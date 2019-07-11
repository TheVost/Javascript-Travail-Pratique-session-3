/**
*   Auteur: Cédric Devost
*   Description: Module JS pour le TP2 de JS2
*   Fichier: module.js
*   Date: 2019-04-21
*/

//Instanciation du module
var MonApp = (function () {
    var app = {};

    //instanciation des variables qui seront utiliser à travers le module
    var produits = produit;
    var maxProduit = produits.length;
    var nbParPage = maxProduit;
    var affichage = "grille";
    var tableauItem = [];
    var nbPages;
    var current = 0;
    var nextSet = false;
    var prevSet = false;

    //-----------------------------------------------------------------------------------------------------------Fonction afficher
    //affiche les items contenu dans le tableau JSON selon les critères d'affichages sélectionné par l'utilisateur
    app.afficher = function () {
        var liste = document.getElementById('listeProduits');
        var div = document.getElementById('navigation');

        //vérifie d'abord le mode d'affichage, grille ou liste et ajoute une class au conteneur afin de modifier la mise en page
        if (affichage == 'liste') {
            liste.classList.add('liste');
            liste.classList.remove('grille');
        } else if (affichage == 'grille') {
            liste.classList.add('grille');
            liste.classList.remove('liste');
        }
        
        //vérifie si le conteneur est déjà rempli.
        //Si oui, le vide
        if (liste.childElementCount != 0) {
            liste.innerHTML = "";
        }

        //Vérifie si le nombre de produit par page est différent du nombre total de produit dans la liste
        //Si oui, traite ainsi les données dynamaiquement:
        if (nbParPage != maxProduit) {
            var extra = 0;
            
            //calcul du nombre de page au total nécessaire pour afficher les articles
            nbPages = Math.floor(maxProduit / nbParPage) + 1;

            //vérifie si le div de navigation est déjà rempli, le vide si c'est le cas
            //afin que le bon nombre de lien soit présent
            if (div.childElementCount != 0) {
                div.innerHTML = "";
            }

            //création du bouton précédent et ajout de certains attributs
            var previous = document.createElement('a');
            previous.setAttribute('id', 'previous');
            previous.setAttribute('href', '#');
            previous.innerHTML = '<';
            div.appendChild(previous);

            //boucle d'affichage qui crée les pages et leur contenu
            for (var j = 0; j < nbPages; j++) {
                
                //création du conteneur de chaque page
                //on l'ajoute au contenur de tous les articles
                var container = document.createElement('div');
                container.setAttribute('id', 'container' + j);
                liste.appendChild(container);

                //boucle d'Affichage qui rempli chaque page avec le contenu correspondant
                for (var i = nbParPage * j; i < nbParPage * (j + 1); i++) {
                    
                    //valide que le produit existe
                    //si oui, l'ajoute à la page
                    if (produits[i]) {
                        
                        //rempli le conteneur dynamiquement
                        //ajoute également l'Attribut onclick à chaque produit et l'Associe à la fonction ajouterProduit
                        var theContainer = document.getElementById('container' + j);
                        theContainer.innerHTML += '<a href="#" class="lienItem" id="article' + i + '" onclick="MonApp.ajouterProduit(' + i + ')"><article class="produit">' +
                            '<header class="nom">' + produits[i].nom + '</header>' +
                            '<section class="image"><img src="' + produits[i].image + '"></section>' +
                            '<section class="description">' + produits[i].description + '</section>' +
                            '<section class="prix"> <span class="prix-valeur">' + produits[i].prix.valeur + '$' + '</span> <span class="prix-unite">' + produits[i].prix.unite + '</span> </section>' +
                            '<section class="categorie">' + produits[i].categorie + '</section>' +
                            '<span id="ajouter">Ajouter au Panier</span></article></a>';

                    } 
                    
                    //si il n'Existe pas, incrémente la variable des tours de boucle exédentaires
                    else {
                        extra++;
                    }
                }
                
                //vérifie que le nombre de tours de boucle exédentaire ne soit pas suppérieur au nombre de produit par page
                //si ce n'Est pas le cas, création du bouton correspondant à chacune des pages
                //ajoute également l'Attribut onclick à chaque bouton et l'Associe à la fonction changerPage
                if (extra <= nbParPage) {
                    var node = document.createElement('a');
                    node.setAttribute('onclick', 'MonApp.changerPage(' + j + ')');
                    node.setAttribute('id', 'lien' + j);
                    node.setAttribute('class', 'rond');
                    node.setAttribute('href', '#');
                    node.textContent = j + 1;
                    div.appendChild(node);
                }
            }
            
            //création du bouton suivant et ajout de certains attributs
            var next = document.createElement('a');
            next.setAttribute('id', 'next');
            next.setAttribute('href', '#');
            next.innerHTML = '>';
            div.appendChild(next);

            //appel à la fonction de changement de page qui recoit en paramêtre la page courante (permettant de rester sur la même page si on change de mode d'affichage par exemple) (par défaut == 0)
            this.changerPage(current);
        } 
        
        //si le nombre de produit par page (par défaut == au nombre max de produit) est bien égale au nombre max de produit
        else {
            
            //vidage de la navigation de bas de page si elle est remplie
            if (div.childElementCount != 0) {
                div.innerHTML = "";
            }
            
            //boucle d'Affichage qui rempli chaque page avec le contenu correspondant
            //ajoute également l'Attribut onclick à chaque produit et l'Associe à la fonction ajouterProduit
            for (var i = 0; i < maxProduit; i++) {
                liste.innerHTML += '<a href="#" class="lienItem" id="article' + i + '" onclick="MonApp.ajouterProduit(' + i + ')"><article class="produit">' +
                    '<header class="nom">' + produits[i].nom + '</header>' +
                    '<section class="image"><img src="' + produits[i].image + '"></section>' +
                    '<section class="description">' + produits[i].description + '</section>' +
                    '<section class="prix"> <span class="prix-valeur">' + produits[i].prix.valeur + '$' + '</span> <span class="prix-unite">' + produits[i].prix.unite + '</span> </section>' +
                    '<section class="categorie">' + produits[i].categorie + '</section>' +
                    '<span id="ajouter">Ajouter au Panier</span></article></a>';

            }
        }
    };

    //-----------------------------------------------------------------------------------------------------------Fonction changerPage
    //change de page en fonction du bouton sur lequel on clique
    //prend le numéro de la page en paramêtre
    app.changerPage = function (numPage) {
        
        //met à jour le numéro de la page courante
        current = numPage;
        
        //va chercher les boutons suivant et précédents maintenant crée
        var precedent = document.getElementById('previous');
        var suivant = document.getElementById('next');

        //fait appel à la fonction changerPage et lui passe en paramêtre la page courante + 1
        suivant.onclick = function(){
            MonApp.changerPage(current + 1);
        }
        
        //fait appel à la fonction changerPage et lui passe en paramêtre la page courante - 1
        precedent.onclick = function(){
            MonApp.changerPage(current - 1);
        }
        
        var nav = document.getElementById('navigation').getElementsByTagName('a');

        //boucle d'affichage qui vérifie si les liens contenus dans le div de navigation correspond à la page courante
        //pour le lien active
        for (var j = 0; j < nav.length; j++) {
            
            //si correspond, ajoute la class active
            if (nav[j].id == 'lien' + current) {
                nav[j].classList.add('active');
            } 
            
            //si non, enlève la class active
            else {
                nav[j].classList.remove('active');
            }
        }
        
        //vérifie si la page courante est 0
        //si oui, change le display à none pour le bouton precedent et met le display à inline-block pour suivant
        if (numPage == 0) {
            precedent.style.display = 'none';
            suivant.style.display = 'inline-block';
        } 
        
        //si la page courrante est égale au nombre de page - 1, change le display à none pour le bouton suivant et met le display à inline-block pour precedent
        else if (nbPages - 1 == current) {
            suivant.style.display = 'none';
            precedent.style.display = 'inline-block';
        } 
        
        //dans tous les autres cas, les deux boutons sont à inline-block
        else {
            precedent.style.display = 'inline-block';
            suivant.style.display = 'inline-block';
        }

        var divs = document.getElementById('listeProduits');
        divs = divs.getElementsByTagName('div');

        //boucle d'Affichage qui détermine quel des pages va être affichée
        for (var i = 0; i < divs.length; i++) {
            
            //si l'id de la page cerrespond à celui du numéro de la page en paramêtre
            //on lui ajoute une classe visible(rend visible) et lui enlève celle hidden(rend invisible)
            if (divs[i].id == 'container' + numPage) {
                divs[i].classList.remove('hidden');
                divs[i].classList.add('visible');
            } 
            
            //sinon, on lui enlève la classe visible et lui met la classe hidden
            else {
                divs[i].classList.remove('visible');
                divs[i].classList.add('hidden');

            }
        }
    };

    //-----------------------------------------------------------------------------------------------------------Fonction getNombreProduit
    //détermine le nombre de produit à afficher dans le panier
    app.getNombreProduit = function () {
        
        //va chercher l'élément panier envoyé dans le localStorage
        var nbProduits = localStorage.getItem('panier');
        var span = document.getElementById('panierSpan');

        //le remet en tableau et compte ses éléments pour le retourner dans le span prévu à cet effet
        nbProduits = JSON.parse(nbProduits);
        span.innerHTML = nbProduits.length;
    };

    //-----------------------------------------------------------------------------------------------------------Fonction setNombreParPage
    //Établie le nombre d'item affiché par page
    app.setNombreParPage = function () {
        var nombre = document.getElementById('select');
        nombre = nombre.value;

        //si la varibale nombre est égale à Tous, le nombre par page correspond alors au nombre total d'item
        if (nombre == 'Tous') {
            nbParPage = produits.length;
        } 
        
        //sinon, le nombre par page est égale au contenu de la variable
        else {
            nbParPage = nombre;
        }

        //appel ensuite à la fonction afficher pour refaire un affichage en conséquence
        this.afficher();
    };

    //-----------------------------------------------------------------------------------------------------------Fonction setModeAffichage
    //détermine le mode d'affichage
    //recoit le mode d'Affichage en paramètre
    app.setModeAffichage = function (mode) {
        affichage = mode;
        
        //appel ensuite à la fonction afficher pour refaire un affichage en conséquence
        this.afficher();
    };

    //-----------------------------------------------------------------------------------------------------------Fonction ajouterProduit
    //ajoute le produit entré en paramêtre au panier
    app.ajouterProduit = function (produit) {
        var deja = false;
        var articleAentrer = [];
        
        //on retrouve l'item entré en paramètre à travers la liste des produits
        var item = produits[produit];

        //boucle qui détermine si l'item en question est déjà dans un tableau d'items (par défaut == [])
        for (var i = 0; i < tableauItem.length; i++) {
            
            //si l'élément existe, deja devient true
            if (tableauItem[i] == item) {
                deja = true;
            }
        }

        //si deja est faux (par defaut == false), met l'item dans le tableaIem
        if (deja == false) {
            tableauItem.push(item);
        }

        //met dans un tableau articleAentrer (pour ne pas écraser le contenu de tableauItem) la string du contenu de l'item
        //le met ensuite en local storage
        articleAentrer = JSON.stringify(tableauItem);
        localStorage.setItem('panier', articleAentrer);
        
        //appel à la fonction getNombreProduit pour recalculer le nombre de prduit et le mettre à jour
        this.getNombreProduit();
    };

    //retourne l'app
    return app;
})();