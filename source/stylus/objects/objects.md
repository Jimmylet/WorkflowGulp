# Objects

**Éléments de mise en forme non-cosmétique**  
C'est ici que l'on mets les styles structurant de notre document. On peut également faire un fichier structure.styl pour y mettre toute notre structure de base pour notre page.

Examples :

```css
main 
    width: $mainSize;
    margin: ( $mainSize / 4 ) auto 0;


header
    margin: 0 auto 2rem;
    padding: .5rem;

section.identity
    width: $mainSize / 3;
    float: left;

section.stuffs
    width: $mainSize * 2 / 3;
    float: right;
    padding-left: 4rem;

footer
    &:before
        content: " ";
        display: table;
        clear: both;
```