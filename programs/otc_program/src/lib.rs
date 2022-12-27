use anchor_lang::{prelude::*};
use anchor_spl::{token::{self, CloseAccount, Mint, SetAuthority, TokenAccount, Transfer}, associated_token::AssociatedToken};
use spl_token::instruction::AuthorityType;



declare_id!("2LG6Wv5UkCWcVx3d8MGXA2v7cbhHnHedYMw74n3gokRV");

const OTC_PDA_SEED: &[u8] = b"otc_authority";

#[program]
pub mod otc_program {
    use super::*;

    pub fn create_otc(ctx: Context<CreateOTC>,base_amount: u64, quote_amount: u64,base_quote_rate:u64
    ) -> Result<()> {

        let otc_account = &mut ctx.accounts.otc_account;

         otc_account.owner = ctx.accounts.owner.to_account_info().key();
         otc_account.base_token_mint = ctx.accounts.base_token_mint.to_account_info().key();
         otc_account.quote_token_mint = ctx.accounts.quote_token_mint.to_account_info().key();
         otc_account.base_token_account = ctx.accounts.base_token_account.to_account_info().key();
         otc_account.base_amount = base_amount;
         otc_account.quote_amount = quote_amount;
         otc_account.otc_base_token_account = ctx.accounts.otc_base_token_account.to_account_info().key();
         otc_account.owner_quote_token_account = ctx.accounts.quote_token_account.to_account_info().key();
         otc_account.base_quote_rate = base_quote_rate;
         otc_account.sold = 0;

         
         let (otc_authority, _otc_authority_bump) =
         Pubkey::find_program_address(&[OTC_PDA_SEED,&ctx.accounts.otc_account.to_account_info().key().to_bytes()[..]], ctx.program_id);

         token::set_authority(
             ctx.accounts.into_set_authority_context(),
             AuthorityType::AccountOwner,
             Some(otc_authority),
         )?;
 
         token::transfer(
             ctx.accounts.into_transfer_to_temp_token_context(),
             base_amount,
         )?;
        Ok(())
    }

 pub fn make_trade(ctx: Context<MakeTrade>, maker_amount:u64
 )-> Result<()>{
    let otc_account = &ctx.accounts.otc_account;

    let base_decimals = ctx.accounts.base_token_mint.decimals;
    let quote_decimals = ctx.accounts.quote_token_mint.decimals;

    let base_transfer_amount: u128 = (otc_account.base_quote_rate as u128 * maker_amount  as u128 * u128::pow(10, base_decimals as u32)) / ( u128::pow(10, quote_decimals as u32) * u128::pow(10, 9) );

    let (otc_authority, _otc_authority_bump) =
    Pubkey::find_program_address(&[OTC_PDA_SEED,&ctx.accounts.otc_account.to_account_info().key().to_bytes()[..]], ctx.program_id);
    let authority_seeds = &[&OTC_PDA_SEED[..],&ctx.accounts.otc_account.to_account_info().key().to_bytes()[..],&[_otc_authority_bump]];


    if otc_authority != *ctx.accounts.otc_authority_account.to_account_info().key {
        return Err(error!(ErrorCode::InvalidAuthorityAccount));


    } 
    token::transfer(
        ctx.accounts.into_transfer_quote_to_owner(),
        maker_amount,
    )?;
    token::transfer(
        ctx.accounts.into_transfer_base_to_owner().with_signer(&[&authority_seeds[..]]), 
        base_transfer_amount as u64).unwrap();

    ctx.accounts.otc_account.sold += base_transfer_amount as u64;

        




    Ok(())
 }   


}

#[derive(Accounts)]

pub struct CreateOTC<'info> {

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,        
        space = 232,
    )]
    pub otc_account: Box<Account<'info,OtcAccount>>,


    #[account(
        init,
        payer = owner,
        token::mint = base_token_mint,
        token::authority = owner,
    )]
    pub otc_base_token_account: Box<Account<'info,TokenAccount>>,

    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = quote_token_mint, 
        associated_token::authority = owner
    )]
    pub quote_token_account: Box<Account<'info,TokenAccount>>,

    pub quote_token_mint : Account<'info,Mint>,

    #[account(
        token::mint = base_token_mint,
        mut
    )]
    pub base_token_account : Box<Account<'info,TokenAccount>>,

    pub base_token_mint: Account<'info,Mint>,


    pub token_program: AccountInfo<'info>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub rent: Sysvar<'info, Rent>,

    pub system_program: Program<'info, System>,

}

#[account]
pub struct OtcAccount{

    pub owner : Pubkey,

    pub base_token_mint: Pubkey,

    pub quote_token_mint: Pubkey,

    pub base_token_account: Pubkey,

    pub base_amount: u64,

    pub quote_amount: u64,

    pub sold : u64,

    pub base_quote_rate: u64,

    pub otc_base_token_account: Pubkey,

    pub owner_quote_token_account: Pubkey,



}
#[derive(Accounts)]
pub struct MakeTrade <'info> {

    #[account(mut)]

    pub owner: Signer<'info>,

    #[account(mut,
        constraint = otc_account.base_token_mint == *base_token_mint.to_account_info().key,
        constraint = otc_account.quote_token_mint == *quote_token_mint.to_account_info().key,
    )]
    pub otc_account: Box<Account<'info,OtcAccount>>,

    pub quote_token_mint : Box<Account<'info,Mint>>,

    #[account(
        token::mint = quote_token_mint
    )]
    pub quote_token_account : Box<Account<'info,TokenAccount>>,

    #[account(
        mut,
        token::mint = quote_token_mint,
        
    )]
    pub owner_quote_token_account : Box<Account<'info,TokenAccount>>,

    pub base_token_mint: Box<Account<'info,Mint>>,

    #[account(
        mut,
        token::mint = base_token_mint
        
    )]
    pub otc_base_token_account: Box<Account<'info,TokenAccount>>,

    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = base_token_mint, 
        associated_token::authority = owner
    )]
    pub owner_base_token_account: Box<Account<'info,TokenAccount>>,

    pub otc_authority_account: AccountInfo<'info>,

    pub token_program: AccountInfo<'info>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub rent: Sysvar<'info, Rent>,

    pub system_program: Program<'info, System>,

}
impl <'info> MakeTrade<'info>{
      fn into_transfer_quote_to_owner(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self
                .quote_token_account
                .to_account_info()
                .clone(),
            to: self.owner_quote_token_account.to_account_info().clone(),
            authority: self.owner.to_account_info().clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }
    fn into_transfer_base_to_owner(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self
                .otc_base_token_account
                .to_account_info()
                .clone(),
            to: self.owner_base_token_account.to_account_info().clone(),
            authority: self.otc_authority_account.to_account_info().clone(),
        };
        CpiContext::new(self.token_program.clone(), cpi_accounts)
    }       
}
impl<'info>CreateOTC<'info> {

  fn into_set_authority_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
    let cpi_accounts = SetAuthority {
        account_or_mint: self.otc_base_token_account.to_account_info().clone(),
        current_authority: self.owner.to_account_info().clone(),
    };
    CpiContext::new(self.token_program.clone(), cpi_accounts)
  }
  fn into_transfer_to_temp_token_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
    let cpi_accounts = Transfer {
        from: self
            .base_token_account
            .to_account_info()
            .clone(),
        to: self.otc_base_token_account.to_account_info().clone(),
        authority: self.owner.to_account_info().clone(),
    };
    CpiContext::new(self.token_program.clone(), cpi_accounts)
  }

}


#[error_code]
pub enum ErrorCode {
    #[msg("Invalid Authority Account")]
    InvalidAuthorityAccount,
}