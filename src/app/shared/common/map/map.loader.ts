import { Injectable } from '@angular/core';

declare var window: any;


 // Credits to: Günter Zöchbauer
 // StackOverflow Post: https://stackoverflow.com/a/39331160/968772
@Injectable()

export class MapLoaderService {
    private static promise: Promise<any>;
   

  public static load(): Promise<any> {
      let browserKey = "AIzaSyCW1rPYeTgjtzn93w2jqSmdE3-BiKk1I-8";
    let map = {
      URL: 'https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing&key=' + browserKey + '&callback=__onGoogleLoaded',      
      }
      
    // First time 'load' is called?
    //if (!this.promise) {

      // Make promise to load
      this.promise = new Promise(resolve => {
        this.loadScript(map.URL);        
        // Set callback for when google maps is loaded.
        window['__onGoogleLoaded'] = ($event) => {
          resolve('google maps api loaded');
        };
      })
    //}

    // Always return promise. When 'load' is called many times, the promise is already resolved.
    return this.promise;
  }
    

  //this function will work cross-browser for loading scripts asynchronously
  static loadScript(src, callback?): void {
    var s: any,
      r,
      t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function () {
      //console.log( this.readyState ); //uncomment this line to see which ready states are called.
      if (!r && (!this.readyState || this.readyState == 'complete')) {
        r = true;
        if (typeof callback === "function")
          callback();
      }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  }

  static GMapPolygonToWKT(poly): string {
       // Start the Polygon Well Known Text (WKT) expression
       var wkt = "POLYGON(";

       var paths = poly.getPaths();
       for (var i = 0; i < paths.getLength(); i++)  {
            var path = paths.getAt(i);

            // Open a ring grouping in the Polygon Well Known Text
            wkt += "(";
            for (var j = 0; j < path.getLength(); j++)   {
                 // add each vertice and anticipate another vertice (trailing comma)
                 wkt += path.getAt(j).lng().toString() + " " + path.getAt(j).lat().toString() + ",";
            }

            // Google's approach assumes the closing point is the same as the opening
            // point for any given ring, so we have to refer back to the initial point
            // and append it to the end of our polygon wkt, properly closing it.
            //
            // Also close the ring grouping and anticipate another ring (trailing comma)
            wkt += path.getAt(0).lng().toString() + " " + path.getAt(0).lat().toString() + "),";
       }

       // resolve the last trailing "," and close the Polygon
       wkt = wkt.substring(0, wkt.length - 1) + ")";

       return wkt;
  }
    
  static GMapMarkerToWKT(longitude, latitude): string {
      // Start the Polygon Well Known Text (WKT) expression
      var wkt = "POINT(" + longitude.toString() + " " + latitude.toString() + ")";
      return wkt;
  }


}

