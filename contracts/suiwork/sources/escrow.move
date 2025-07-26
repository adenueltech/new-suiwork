module suiwork::escrow {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use std::option::{Self, Option};

    // Error codes
    const E_NOT_CLIENT: u64 = 1;
    const E_ALREADY_LOCKED: u64 = 3;
    const E_NOT_LOCKED: u64 = 4;
    const E_INSUFFICIENT_FUNDS: u64 = 5;

    // Escrow states
    const STATE_CREATED: u8 = 0;
    const STATE_LOCKED: u8 = 1;
    const STATE_COMPLETED: u8 = 2;
    const STATE_DISPUTED: u8 = 3;

    struct EscrowObject has key, store {
        id: UID,
        job_id: u64,
        client: address,
        freelancer: address,
        amount: u64,
        locked_funds: Option<Coin<SUI>>,
        state: u8,
        created_at: u64,
    }

    // Events
    struct EscrowCreated has copy, drop { escrow_id: ID, job_id: u64, client: address, freelancer: address, amount: u64 }
    struct FundsLocked has copy, drop { escrow_id: ID, amount: u64, client: address }
    struct FundsReleased has copy, drop { escrow_id: ID, amount: u64, freelancer: address }
    struct DisputeRaised has copy, drop { escrow_id: ID, raised_by: address }

    // Create new escrow
    public fun create_escrow(
        job_id: u64, client: address, freelancer: address, amount: u64, ctx: &mut TxContext
    ): EscrowObject {
        let escrow_id = object::new(ctx);
        let id_copy = object::uid_to_inner(&escrow_id);
         
        let escrow = EscrowObject {
            id: escrow_id,
            job_id,
            client,
            freelancer,
            amount,
            locked_funds: option::none(),
            state: STATE_CREATED,
            created_at: tx_context::epoch(ctx),
        };

        event::emit(EscrowCreated { escrow_id: id_copy, job_id, client, freelancer, amount });
        escrow
    }

    // Client locks funds in escrow
    public fun lock_funds(escrow: &mut EscrowObject, payment: Coin<SUI>, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == escrow.client, E_NOT_CLIENT);
        assert!(escrow.state == STATE_CREATED, E_ALREADY_LOCKED);
        assert!(coin::value(&payment) >= escrow.amount, E_INSUFFICIENT_FUNDS);

        // Handle the existing value properly before assigning a new one
        if (option::is_some(&escrow.locked_funds)) {
            let old_coin = option::extract(&mut escrow.locked_funds);
            transfer::public_transfer(old_coin, escrow.client);
        };
        
        option::fill(&mut escrow.locked_funds, payment);
        escrow.state = STATE_LOCKED;

        event::emit(FundsLocked {
            escrow_id: object::uid_to_inner(&escrow.id),
            amount: escrow.amount,
            client: escrow.client,
        });
    }

    // Release funds to freelancer
    public fun release_funds(escrow: &mut EscrowObject, ctx: &mut TxContext): Coin<SUI> {
        assert!(tx_context::sender(ctx) == escrow.client, E_NOT_CLIENT);
        assert!(escrow.state == STATE_LOCKED, E_NOT_LOCKED);

        escrow.state = STATE_COMPLETED;
        let payment = option::extract(&mut escrow.locked_funds);

        event::emit(FundsReleased {
            escrow_id: object::uid_to_inner(&escrow.id),
            amount: coin::value(&payment),
            freelancer: escrow.freelancer,
        });

        payment
    }

    // Raise dispute
    public fun raise_dispute(escrow: &mut EscrowObject, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(sender == escrow.client || sender == escrow.freelancer, E_NOT_CLIENT);
        assert!(escrow.state == STATE_LOCKED, E_NOT_LOCKED);

        escrow.state = STATE_DISPUTED;
        event::emit(DisputeRaised { escrow_id: object::uid_to_inner(&escrow.id), raised_by: sender });
    }

    // Refund to client (dispute resolution)
    public fun dispute_refund(escrow: &mut EscrowObject, ctx: &mut TxContext): Coin<SUI> {
        assert!(tx_context::sender(ctx) == escrow.client, E_NOT_CLIENT);
        assert!(escrow.state == STATE_DISPUTED, E_NOT_LOCKED);

        let payment = option::extract(&mut escrow.locked_funds);
        escrow.state = STATE_COMPLETED;
        payment
    }

    // Getter functions
    public fun get_escrow_info(escrow: &EscrowObject): (u64, address, address, u64, u8) {
        (escrow.job_id, escrow.client, escrow.freelancer, escrow.amount, escrow.state)
    }

    public fun is_locked(escrow: &EscrowObject): bool { escrow.state == STATE_LOCKED }
    public fun is_completed(escrow: &EscrowObject): bool { escrow.state == STATE_COMPLETED }
}