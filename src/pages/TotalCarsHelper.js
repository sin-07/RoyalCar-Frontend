// Quick fix for TotalCars loader issue
// This approach checks if cars are actually fetched before hiding loader

const shouldShowLoader = (loading, dataLoaded, globalCars) => {
  // Show loader if:
  // 1. Still loading, OR
  // 2. Data not loaded, OR  
  // 3. No cars in globalCars (even if fetch completed)
  return loading || !dataLoaded || globalCars.length === 0;
};

// Use this in the component:
// if (shouldShowLoader(loading, dataLoaded, globalCars)) {
//   return <CarWheelLoader />
// }

export { shouldShowLoader };
