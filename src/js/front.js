
function initMap() {
    front.mapObject = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.750548, lng: -101.578319},
        zoom: 4,
    });
}

let front = {
    state: 0,
    items: [],
    markers: [],

    init: function () {
        let self = front;
        this.getCompaniesJSON();
        this.events();
    },


    getCompaniesJSON: function () {
        let self = front;
        $.getJSON("dist/js/items.json", function(result){
            console.log(result);
            self.items = result;
            self.loadMarkers(self.items);
        });
    },

    loadMarkers: function (itemsArray) {
        let self = front;
        switch(self.state) {
            case 0: {
                console.log('usa');
                self.mapObject.setCenter(new google.maps.LatLng(39.750548, -101.578319));
                $('.js-map-listing').html('');
                self.removeMarkers(self.markers);
                $.each(itemsArray.usa, function (key, val) {
                    let marker = new google.maps.Marker({
                        position: new google.maps.LatLng(parseFloat(val['address_lat']), parseFloat(val['address_lng'])),
                        map: self.mapObject
                    });
                    self.markers.push(marker);
                    let template = self.template(key, val);
                    $('.js-map-listing').append(template);
                });
                break;
            }
            case 1: {
                self.mapObject.setCenter(new google.maps.LatLng( 57.455882, -102.289566));
                $('.js-map-listing').html('');
                self.removeMarkers(self.markers);
                $.each(itemsArray.canada, function (key, val) {
                    let marker = new google.maps.Marker({
                        position: new google.maps.LatLng(parseFloat(val['address_lat']), parseFloat(val['address_lng'])),
                        map: self.mapObject
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
                <div class="col-lg-2">
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

    events: function () {
        let self = front;

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

$(function () {
    front.init();
});
