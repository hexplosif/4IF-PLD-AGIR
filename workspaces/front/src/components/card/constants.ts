import { Actor, CardType } from "@shared/common/Cards"

export const CARD_COLORS = {
    YELLOW: '#FFF085',
    ORANGE: '#FFAA00',
    RED: '#d96764',
    WHITE: '#FFFFFF',
    BLUE: '#5BC0DE',
    GREEN: '#5cb85c',
    TEAL: '#2DAA9E',
    MINT: '#98D2C0',
}

export const CARD_TYPE_COLORS : Record<CardType, string> = {
    "BestPractice": CARD_COLORS.WHITE,
    "BadPractice": CARD_COLORS.RED,
    "Formation": CARD_COLORS.BLUE,
    "Expert": CARD_COLORS.YELLOW,
    "EmptyCard": CARD_COLORS.WHITE,
}

export const CARD_ACTOR_COLORS : Record<Actor, string> = {
    [Actor.ARCHITECT]: CARD_COLORS.TEAL,
    [Actor.DEVELOPER]: CARD_COLORS.MINT,
    [Actor.PRODUCT_OWNER]: CARD_COLORS.YELLOW,
}

export const CARD_DIFFICULTY_COLORS = [
    CARD_COLORS.GREEN,
    CARD_COLORS.YELLOW,
    CARD_COLORS.ORANGE,
    CARD_COLORS.RED,
]

export const CARD_EXPERT_HEADER_TITLE = {
    [Actor.ARCHITECT]: "Expert Architect",
    [Actor.DEVELOPER]: "Expert Développeur",
    [Actor.PRODUCT_OWNER]: "Expert Fonctionnel", 
}

export const CARD_EXPERT_HEADER_SUBTITLE = {
    [Actor.ARCHITECT]: "Logiciel Écoresponsable",
    [Actor.DEVELOPER]: "Artisan Écoresponsable",
    [Actor.PRODUCT_OWNER]: "Écoresponsable", 
}

export const CARD_FORMATION_HEADER_TITLE = {
    [Actor.ARCHITECT]: "Formation à l'éco-conception tech", 
    [Actor.DEVELOPER]: "Formation au développement green",
    [Actor.PRODUCT_OWNER]: "Formation à la frugalité fonctionnelle", 
}