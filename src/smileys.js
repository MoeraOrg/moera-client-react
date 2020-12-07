export const SMILEY_LIKE = /(^|\s)[-+:;'`,.=^cсDEЕoоOОPРpрbЬьÞþxхXХ0138<>[\](){}|#@$&%*\\/]{2,}(?=\s|$)/;
export const ESCAPED_SMILEYS = /(^|\s)\\([-+:;'`,.=^cсDEЕoоOОPРpрbЬьÞþxхXХ0138<>[\](){}|#@$&%*\\/]{2,})(?=\s|$)/;

export const SMILEYS = [
    {
        // :-) :o) :c) :^)
        regex: /(^|\s):[-oоcс^]?\)(?=\s|$)/,
        emoji: 0x263a
    },
    {
        // :-] :-3 :->
        regex: /(^|\s):-?[3>\]](?=\s|$)/,
        emoji: 0x1f642
    },
    {
        // 8-)
        regex: /(^|\s)8-?\)(?=\s|$)/,
        emoji: 0x1f60a
    },
    {
        // :-}
        regex: /(^|\s):-?}(?=\s|$)/,
        emoji: 0x1f600
    },
    {
        // =] =)
        regex: /(^|\s)=[)\]](?=\s|$)/,
        emoji: 0x1f601
    },
    {
        // :-D
        regex: /(^|\s):-?D(?=\s|$)/,
        emoji: 0x1f603
    },
    {
        // 8-D
        regex: /(^|\s)8-?D(?=\s|$)/,
        emoji: 0x1f604
    },
    {
        // X-D
        regex: /(^|\s)[xхXХ]-D(?=\s|$)/,
        emoji: 0x1f606
    },
    {
        // =D =3
        regex: /(^|\s)=[D3](?=\s|$)/,
        emoji: 0x1f606
    },
    {
        // B^D
        regex: /(^|\s)[BВ]\^D(?=\s|$)/,
        emoji: 0x1f60d
    },
    {
        // :-( ;-(
        regex: /(^|\s)[:;]-?\((?=\s|$)/,
        emoji: 0x2639
    },
    {
        // :-c :-<
        regex: /(^|\s):-?[cс<](?=\s|$)/,
        emoji: 0x1f641
    },
    {
        // :-[
        regex: /(^|\s):-?\[(?=\s|$)/,
        emoji: 0x1f620
    },
    {
        // :-|
        regex: /(^|\s):-?\|(?=\s|$)/,
        emoji: 0x1f610
    },
    {
        // >:-[
        regex: /(^|\s)>:-?\[(?=\s|$)/,
        emoji: 0x1f61f
    },
    {
        // :-{
        regex: /(^|\s):-?{(?=\s|$)/,
        emoji: 0x1f623
    },
    {
        // :-@
        regex: /(^|\s):-?@(?=\s|$)/,
        emoji: 0x1f616
    },
    {
        // :-$
        regex: /(^|\s):-?\$(?=\s|$)/,
        emoji: 0x1f633
    },
    {
        // :'-(
        regex: /(^|\s):['`]-?\((?=\s|$)/,
        emoji: 0x1f62d
    },
    {
        // :'-)
        regex: /(^|\s):['`]-?\)(?=\s|$)/,
        emoji: 0x1f602
    },
    {
        // D-':
        regex: /(^|\s)D-?['`]:(?=\s|$)/,
        emoji: 0x1f628
    },
    {
        // D-:<
        regex: /(^|\s)D-?:<(?=\s|$)/,
        emoji: 0x1f627
    },
    {
        // D-:
        regex: /(^|\s)D-?:(?=\s|$)/,
        emoji: 0x1f626
    },
    {
        // D-8
        regex: /(^|\s)D-?8(?=\s|$)/,
        emoji: 0x1f631
    },
    {
        // D-;
        regex: /(^|\s)D-?;(?=\s|$)/,
        emoji: 0x1f62b
    },
    {
        // D=
        regex: /(^|\s)D=(?=\s|$)/,
        emoji: 0x1f62b
    },
    {
        // :-{
        regex: /(^|\s):-?{(?=\s|$)/,
        emoji: 0x1f623
    },
    {
        // :-O
        regex: /(^|\s):-?[OО0](?=\s|$)/,
        emoji: 0x1f62e
    },
    {
        // :-o
        regex: /(^|\s):-?[oо](?=\s|$)/,
        emoji: 0x1f62f
    },
    {
        // 8-O
        regex: /(^|\s)8-?[OО](?=\s|$)/,
        emoji: 0x1f632
    },
    {
        // >:-O
        regex: /(^|\s)>:-?[OО](?=\s|$)/,
        emoji: 0x1f632
    },
    {
        // :-*
        regex: /(^|\s):-?\*(?=\s|$)/,
        emoji: 0x1f618
    },
    {
        // ;-) *-) ;-] ;-D
        regex: /(^|\s)[;*]-?[)\]D](?=\s|$)/,
        emoji: 0x1f609
    },
    {
        // ;^)
        regex: /(^|\s);\^\)(?=\s|$)/,
        emoji: 0x1f60f
    },
    {
        // ;-,
        regex: /(^|\s);-,(?=\s|$)/,
        emoji: 0x1f60f
    },
    {
        // :-P :-b
        regex: /(^|\s):-?[PРpрbЬьÞþ](?=\s|$)/,
        emoji: 0x1f61b
    },
    {
        // ;-P ;-b
        regex: /(^|\s);-?[PРpрbЬьÞþ](?=\s|$)/,
        emoji: 0x1f61c
    },
    {
        // X-P X-b
        regex: /(^|\s)[XХxх]-[PРpрbЬьÞþ](?=\s|$)/,
        emoji: 0x1f61d
    },
    {
        // :-/ >:-/
        regex: /(^|\s)>?:-?[\\/](?=\s|$)/,
        emoji: 0x1f615
    },
    {
        // =/
        regex: /(^|\s)=[\\/](?=\s|$)/,
        emoji: 0x1f615
    },
    {
        // :-.
        regex: /(^|\s):-\.(?=\s|$)/,
        emoji: 0x1f914
    },
    {
        // :-X :-# :-&
        regex: /(^|\s):-?[XХxх#&](?=\s|$)/,
        emoji: 0x1f910
    },
    {
        // O:-) O:-3 O:^)
        regex: /(^|\s)[OО0][:;][-^]?[)3](?=\s|$)/,
        emoji: 0x1f607
    },
    {
        // >:-) }:-) 3:-)
        regex: /(^|\s)[>}3][:;]-?\)(?=\s|$)/,
        emoji: 0x1f608
    },
    {
        // |:-)
        regex: /(^|\s)\|[:;]-\)(?=\s|$)/,
        emoji: 0x1f60e
    },
    {
        // |-O
        regex: /(^|\s)\|-[OО0](?=\s|$)/,
        emoji: 0x1f971
    },
    {
        // #-) %-)
        regex: /(^|\s)[#%]-\)(?=\s|$)/,
        emoji: 0x1f974
    },
    {
        // ',:-|
        regex: /(^|\s)['`],:-\|(?=\s|$)/,
        emoji: 0x1f928
    },
    {
        // :-E
        regex: /(^|\s):-?[EЕ](?=\s|$)/,
        emoji: 0x1f62c
    },
    {
        // <3
        regex: /(^|\s)<3(?=\s|$)/,
        emoji: 0x2764
    },
    {
        // </3
        regex: /(^|\s)<[\\/]3(?=\s|$)/,
        emoji: 0x1f494
    },
    {
        // :+1 :+1:
        regex: /(^|\s):+1:?(?=\s|$)/,
        emoji: 0x1f44d
    },
    {
        // :-1 :-1:
        regex: /(^|\s):-1:?(?=\s|$)/,
        emoji: 0x1f44e
    }
];
