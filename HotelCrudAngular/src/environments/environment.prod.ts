export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && window.env && window.env.apiUrl)
      ? window.env.apiUrl
      //: 'http://localhost:7150/api/Hotel'  // URL de la API para prod
      : 'https://hotel-back-qa.azurewebsites.net/api/hotel'
};
