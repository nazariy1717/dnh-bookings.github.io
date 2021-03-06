
let front = {

    state: 0,
    items: [],
    markers: [],
    loaded: 0,
    mapObject: null,

    hamburger: $('.hamburger'),
    nav: $('.header-list'),

    init: function (map) {
        let self = front;
        self.mapObject = map;
        this.getCompaniesJSON();
        this.events();
    },


    getCompaniesJSON: function () {
        let self = front;
        $.getJSON("dist/js/items.json", function(result){
            self.items = result;
            self.loadMarkers(self.items);
        });
    },

    loadMarkers: function (itemsArray) {
        let self = front;
        switch(self.state) {
            case 0: {
                if(self.loaded){
                    self.mapObject.setCenter(new google.maps.LatLng(39.750548, -101.578319));
                }
                $('.js-map-listing').html('');
                self.removeMarkers(self.markers);
                $.each(itemsArray.usa, function (key, val) {
                    let marker = new google.maps.Marker({
                        position: new google.maps.LatLng(parseFloat(val['address_lat']), parseFloat(val['address_lng'])),
                        map: self.mapObject,
                        icon: 'dist/img/marker.png?1'
                    });
                    self.markers.push(marker);
                    let template = self.template(key, val);
                    $('.js-map-listing').append(template);
                });
                self.loaded = 1;
                break;
            }
            case 1: {
                self.mapObject.setCenter(new google.maps.LatLng( 57.455882, -102.289566));
                $('.js-map-listing').html('');
                self.removeMarkers(self.markers);
                $.each(itemsArray.canada, function (key, val) {
                    let marker = new google.maps.Marker({
                        position: new google.maps.LatLng(parseFloat(val['address_lat']), parseFloat(val['address_lng'])),
                        map: self.mapObject,
                        icon: 'dist/img/marker.png?1'
                    });
                    self.markers.push(marker);
                    let template = self.template(key, val);
                    $('.js-map-listing').append(template);
                });
                break;
            }
            default: break;
        }
    },

    removeMarkers: function (markers) {
        for(let i=0; i<markers.length; i++){
            markers[i].setMap(null);
        }
        self.markers=[];
    },


    template: function(key, array){
        return `
                <div class="col-lg-2 col-md-3 col-4 map-listing__column">
                    <div class="item" data-index="${key}">
                        <div class="item__head">
                            <span class="item__title">${array.name}</span>
                        </div>
                        <div class="item__content">
                            <span class="item__count">${key}</span>
                        </div>
                    </div>
                </div>
            `;
    },

    toggleNav: function(){
        if (!this.hamburger.hasClass('is-active')) {
            this.hamburger.addClass("is-active");
            this.nav.toggleClass('js-show');
        }
        else {
            this.hamburger.removeClass("is-active");
            this.nav.toggleClass('js-show');
        }
    },

    events: function () {
        let self = front;

        $(document).on('click', '.hamburger', function () {
            self.toggleNav();
        });

        $(document).on('click', '.js-map-control', function(){
            if(!$(this).hasClass('active')){
                $('.js-map-control').removeClass('active');
                $(this).addClass('active');
                if(self.state === 0){
                    self.state = 1;
                } else {
                    self.state = 0;
                }
                self.loadMarkers(self.items);
            }
        });

    },
};


$(document).ready(function(){
});

