let lat;
let lon;
let before = document.getElementById('beforeShow');
let after = document.getElementById('afterShow');
const apiKey = 'fe9bc891a1a74bedbfa07061ca9b3911';


function getLocation() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          // console.log(lon, " ", lat);
          resolve({ lat, lon });
        },
        (error) => {
          reject("Geolocation error: " + error.message);
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}


//by location
const getData = async() =>{
    const data = await getLocation();
    // console.log(data);

    try{
        const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${data.lat}&lon=${data.lon}&format=json&apiKey=${apiKey}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const jsonData = await res.json();
      // console.log(jsonData);

      before.innerHTML=`
          <div>
             <p>Name of the Time Zone :${jsonData.results[0].timezone.name}</p>
          </div>
          <div>
             <p>Lat :${jsonData.query.lat}</p>
             <p>Long :${jsonData.query.lon}</p>
          </div>
          <div>
             <p>Offset STD :${jsonData.results[0].timezone.offset_STD
             }</p>
             <p>Offset STD second :${jsonData.results[0].timezone.
              offset_DST_seconds}</p>
             <p>Offset DST :${jsonData.results[0].timezone.
              offset_DST
              }</p>
             <p>Offset DST seconds :${jsonData.results[0].timezone.offset_DST_seconds
             }</p>
             <p>Country :${jsonData.results[0].country}</p>
             <p>Postcode :${jsonData.results[0].postcode}</p>
             <p>City :${jsonData.results[0].city}</p>
          </div>
      `;
    }
    catch(error){
      throw new Error(error);
    }
}
getData();

//timezone by adding the address
document.getElementById('submit').addEventListener('click', async function(){
  const address = document.getElementById('address').value;

  if(!address){
    document.getElementById('submit').innerHTML=`
      <div>
       <p>Please Enter the address!!</p>
      </div>
    `;
    return;
  }
  
  try{
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`
    );

    if(!response.ok){
      throw new Error('getting error while fetching time zone from address,Try after some time');
    }

    const data = await response.json();
    // console.log(data);

    if(data.features.length===0){
      after.innerHTML=`
        <div>
          <p>Unable to find the results!</p>
        </div>
      `;
    }
    else{
      after.innerHTML=`
          <div>
             <p>Name of the Time Zone :${data.features[0].properties.timezone.name}</p>
          </div>
          <div>
             <p>Lat :${data.features[0].properties.lat}</p>
             <p>Long :${data.features[0].properties.lon}</p>
          </div>
          <div>
             <p>Offset STD :${data.features[0].properties.timezone.offset_STD
             }</p>
             <p>Offset STD second :${data.features[0].properties.timezone.
              offset_DST_seconds}</p>
             <p>Offset DST :${data.features[0].properties.timezone.
              offset_DST
              }</p>
             <p>Offset DST seconds :${data.features[0].properties.timezone.offset_DST_seconds
             }</p>
             <p>Country :${data.features[0].properties.country}</p>
             <p>Postcode :${data.features[0].properties.postcode}</p>
             <p>City :${data.features[0].properties.city}</p>
          </div>
      `;
    }


  }
  catch(error){
    throw new Error(error);
  }
});

