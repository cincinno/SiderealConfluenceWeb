export class Factory {
  constructor(
    public name: string,
    public input_items: { [key: string]: number },
    public output_items: { [key: string]: number },
    public used: boolean,
    public owner: string,
    public run_in_trading: boolean,
    public feature: { type: string, properties: { [key: string]: any } }
  ) {}
}

export class Player {
  constructor(
    public user_id: string,
    public specie: string,
    public specie_zh_name: string,
    public storage: { [key: string]: number },
    public donation_items: { [key: string]: number },
    public factories: { [key: string]: Factory },
    public agreed: boolean,
    public colony_bid: number,
    public research_bid: number
  ) {}
}

export class GameState {
  constructor(
    public players: Player[],
    public current_round: number,
    public stage: string,
    public room_name: string,
    public research_bid_cards: { price: number, item: Factory | null }[],
    public colony_bid_cards: { price: number, item: Factory | null }[],
    public current_pick: { type: string, player: string }
  ) {}
}
