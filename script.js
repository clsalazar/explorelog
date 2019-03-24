'use strict';

(() => {
    let map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 2
    }).addTo(map);

    let fogLayerInner = new L.GridLayer.MaskCanvas({
        radius: 500,
        useAbsoluteRadius: true,
        color: '#000',
        opacity: 0.5,
        noMask: false,
    })

    let fogLayerOuter = new L.GridLayer.MaskCanvas({
        radius: 900,
        useAbsoluteRadius: true,
        color: '#000',
        opacity: 0.7,
        noMask: false,
    })

    fogLayerInner.setData([])
    fogLayerOuter.setData([])
    map.addLayer(fogLayerInner);
    map.addLayer(fogLayerOuter)

    const input = document.getElementById("file-input")
    input.addEventListener("change", function () {
        handleFile(this.files[0])
    })

    const handleFile = (file) => {
        const locations = []
        let reader = new FileReader();
        
        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                document.getElementsByClassName("sk-fading-circle")[0].style.visibility = "visible"
            }
        }
    
        reader.onerror = (event => {
            console.log(`An error eccored: ${error.code}`)
        })
    
        reader.onloadend = (event) => {
            try{
                let data = JSON.parse(event.target.result)
                const scalarE7 = 0.0000001
        
                data.locations.forEach(obj => {
                locations.push([obj.latitudeE7 * scalarE7, obj.longitudeE7 * scalarE7])
                });

                fogLayerInner.setData(locations)
                fogLayerOuter.setData(locations)
                map.fitBounds(fogLayerInner.bounds)

                document.getElementById("map").style.zIndex = "1";
            }

            catch(error){
                alert("Something went wrong reading your file. Please make sure you're uploading 'Location History.json' file from Google")
            }
        }
    
        reader.readAsText(file);
    }       

})();

