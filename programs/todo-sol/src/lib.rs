use anchor_lang::prelude::*;

declare_id!("6TNGj9dN1huS7gawyrFMiRUMtVSXrAVeMDzin9drMcqm");

#[program]
pub mod todo_sol {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub last_todo: u8,
    pub todo_count: u8,
}

#[account]
#[derive(Default)]
pub struct TodoAccount {
    pub authority: Pubkey,
    pub idx: u8,
    pub content: String,
    pub marked: bool,
}

#[constant]
pub const USER_TAG: &[u8] = b"USER_STATE";

#[constant]
pub const TODO_TAG: &[u8] = b"TODO_STATE";
