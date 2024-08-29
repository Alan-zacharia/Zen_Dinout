export const fetchLocationName = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${
        import.meta.env.VITE_API_MAXBOX_TOKEN
      }`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching location name:", error);
    throw error;
  }
};

export const getLocations = async (query: string) => {
  console.log;
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${
        import.meta.env.VITE_API_MAXBOX_TOKEN
      }`
    );
    const data = await res.json();
    return data.features;
  } catch (error) {
    console.log("Error in Get Location", error);
    throw error;
  }
};
