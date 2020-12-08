export const SMILEY_LIKE = /(^|\s)([-+:;'`,.=^cсDEЕoоOОPРpрbЬьÞþxхXХЖ0138<>[\](){}|#@$&%*\\/]{2,})(?=\s|$)/g;

export const SMILEYS = [
    {
        // :-) :o) :c) :^)
        regex: /^:[-oоcс^]?\)$/,
        emoji: 0x263a
    },
    {
        // :-] :-3 :->
        regex: /^:-?[3>\]]$/,
        emoji: 0x1f642
    },
    {
        // 8-)
        regex: /^8-?\)$/,
        emoji: 0x1f60a
    },
    {
        // :-}
        regex: /^:-?}$/,
        emoji: 0x1f600
    },
    {
        // =] =)
        regex: /^=[)\]]$/,
        emoji: 0x1f601
    },
    {
        // :-D
        regex: /^:-?D$/,
        emoji: 0x1f603
    },
    {
        // 8-D
        regex: /^8-?D$/,
        emoji: 0x1f604
    },
    {
        // X-D
        regex: /^[xхXХЖ]-D$/,
        emoji: 0x1f606
    },
    {
        // =D =3
        regex: /^=[D3]$/,
        emoji: 0x1f606
    },
    {
        // B^D
        regex: /^[BВ]\^D$/,
        emoji: 0x1f60d
    },
    {
        // :-( ;-(
        regex: /^[:;]-?\($/,
        emoji: 0x2639
    },
    {
        // :-c :-<
        regex: /^:-?[cс<]$/,
        emoji: 0x1f641
    },
    {
        // :-[
        regex: /^:-?\[$/,
        emoji: 0x1f620
    },
    {
        // :-|
        regex: /^:-?\|$/,
        emoji: 0x1f610
    },
    {
        // >:-[
        regex: /^>:-?\[$/,
        emoji: 0x1f61f
    },
    {
        // :-{
        regex: /^:-?{$/,
        emoji: 0x1f623
    },
    {
        // :-@
        regex: /^:-?@$/,
        emoji: 0x1f616
    },
    {
        // :-$
        regex: /^:-?\$$/,
        emoji: 0x1f633
    },
    {
        // :'-(
        regex: /^:['`]-?\($/,
        emoji: 0x1f62d
    },
    {
        // :'-)
        regex: /^:['`]-?\)$/,
        emoji: 0x1f602
    },
    {
        // D-':
        regex: /^D-?['`]:$/,
        emoji: 0x1f628
    },
    {
        // D-:<
        regex: /^D-?:<$/,
        emoji: 0x1f627
    },
    {
        // D-:
        regex: /^D-?:$/,
        emoji: 0x1f626
    },
    {
        // D-8
        regex: /^D-?8$/,
        emoji: 0x1f631
    },
    {
        // D-;
        regex: /^D-?;$/,
        emoji: 0x1f62b
    },
    {
        // D=
        regex: /^D=$/,
        emoji: 0x1f62b
    },
    {
        // :-{
        regex: /^:-?{$/,
        emoji: 0x1f623
    },
    {
        // :-O
        regex: /^:-?[OО0]$/,
        emoji: 0x1f62e
    },
    {
        // :-o
        regex: /^:-?[oо]$/,
        emoji: 0x1f62f
    },
    {
        // 8-O
        regex: /^8-?[OО]$/,
        emoji: 0x1f632
    },
    {
        // >:-O
        regex: /^>:-?[OО]$/,
        emoji: 0x1f632
    },
    {
        // :-*
        regex: /^:-?\*$/,
        emoji: 0x1f618
    },
    {
        // ;-) *-) ;-] ;-D
        regex: /^[;*]-?[)\]D]$/,
        emoji: 0x1f609
    },
    {
        // ;^)
        regex: /^;\^\)$/,
        emoji: 0x1f60f
    },
    {
        // ;-,
        regex: /^;-,$/,
        emoji: 0x1f60f
    },
    {
        // :-P :-b
        regex: /^:-?[PРpрbЬьÞþ]$/,
        emoji: 0x1f61b
    },
    {
        // ;-P ;-b
        regex: /^;-?[PРpрbЬьÞþ]$/,
        emoji: 0x1f61c
    },
    {
        // X-P X-b
        regex: /^[XХЖxх]-[PРpрbЬьÞþ]$/,
        emoji: 0x1f61d
    },
    {
        // :-/ >:-/
        regex: /^>?:-?[\\/]$/,
        emoji: 0x1f615
    },
    {
        // =/
        regex: /^=[\\/]$/,
        emoji: 0x1f615
    },
    {
        // :-.
        regex: /^:-\.$/,
        emoji: 0x1f914
    },
    {
        // :-X :-# :-&
        regex: /^:-?[XХЖxх#&]$/,
        emoji: 0x1f910
    },
    {
        // O:-) O:-3 O:^)
        regex: /^[OО0][:;][-^]?[)3]$/,
        emoji: 0x1f607
    },
    {
        // >:-) }:-) 3:-)
        regex: /^[>}3][:;]-?\)$/,
        emoji: 0x1f608
    },
    {
        // |:-)
        regex: /^\|[:;]-\)$/,
        emoji: 0x1f60e
    },
    {
        // |-O
        regex: /^\|-[OО0]$/,
        emoji: 0x1f971
    },
    {
        // #-) %-)
        regex: /^[#%]-\)$/,
        emoji: 0x1f974
    },
    {
        // ',:-|
        regex: /^['`],:-\|$/,
        emoji: 0x1f928
    },
    {
        // :-E
        regex: /^:-?[EЕ]$/,
        emoji: 0x1f62c
    },
    {
        // <3
        regex: /^<3$/,
        emoji: 0x2764
    },
    {
        // </3
        regex: /^<[\\/]3$/,
        emoji: 0x1f494
    },
    {
        // :+1 :+1:
        regex: /^:\+1:?$/,
        emoji: 0x1f44d
    },
    {
        // :-1 :-1:
        regex: /^:-1:?$/,
        emoji: 0x1f44e
    }
];
