// Import statements should always be at the top
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';





// Mapping over products to create list items

function FloatingButton({ consent, bannerstate, handleConsent, handleBanner }) {
  return (
    <button onClick={() => handleBanner(false)} className="floating-button">
      Preference Center
    </button>
  );
}

function DropDown({ selectedOption, handleChange }) {

  return (
    <div className="dropdown-container">
      <label htmlFor="dropdown">Choose an option:</label>
      <select id="dropdown" value={selectedOption} onChange={handleChange}>
        <option value="">Select...</option>
        <option value="lightblue">Blue</option>
        <option value="lightgreen">Green</option>
        <option value="orange">Orange</option>
      </select>
      {selectedOption && <p>You selected: {selectedOption}</p>}
    </div>
  );
}


function CookieBanner({ consent, bannerstate, handleConsent, handleBanner, loaded}) {
  if (!loaded || bannerstate === true) return null;

  return (
    <div className="cookieContainer">
      <div className="content">
        <p>Do you consent to this website processing your data?</p>
        <div className="cookie">
          <button onClick={() => { handleConsent('accept'); handleBanner(true); }}>Accept {consent}</button>
          <button onClick={() => { handleConsent('reject'); handleBanner(true); }}>Reject {consent}</button>
        </div>
      </div>
    </div>
  );
}


// MyHeading component
function MyHeading() {
  return (
    <div>
      <h1 className="content">Manish's Website</h1>
      <title>My Website</title>
    </div>
  );
}

// MyApp component that displays the current date
function MyApp({ consent,selectedOption }) {




if(consent==='reject')
  {return (
    <div>
      <MyHeading />
      <p style={{ backgroundColor: selectedOption, padding: "10px" }}>This is my page and you have {consent}ed consent to processing data</p>
    </div>
  );}
  else if(consent==='accept'){
  document.cookie = `backgroundColor=${selectedOption}; path=/; max-age=31536000`;
    return(<div>
    <MyHeading />
          <p style={{ backgroundColor: selectedOption, padding: "10px" }}>This is my page and you have consented to processing data</p>
    </div>)
    ;
    }
  else {
  return(<div>
  <MyHeading />
  <p className="avatar">You have not consented yet</p>
  </div>)
  ;
  }
}

// MyPrivacyApp component that conditionally renders based on the current date
export default function MyPrivacyApp() {
  // 🟢 Stores the user's consent status: 'accept', 'reject', or null (not yet given)
  const [consent, setConsent] = useState(null);

  // 🟠 Tracks whether the cookie banner is currently visible (false = show it)
  const [bannerstate, setBannerstate] = useState(false);

  // 🔵 Stores the selected background color from the dropdown
  const [selectedOption, setSelectedOption] = useState("");

  // 🌍 Stores geolocation info fetched from the IP-based API after consent
  const [geoData, setGeoData] = useState(null);

  // 🍪 Stores user information (device + geo) saved in the cookie after consent
  const [cookieInfo, setCookieInfo] = useState(null);

  // ✅ Tracks if initial data has finished loading (used to delay showing banner until ready)
  const [loaded, setLoaded] = useState(false);

const deviceDetails = {
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  screenResolution: `${window.screen.width}x${window.screen.height}`,
};


function handleChange(event) {
    setSelectedOption(event.target.value);
  }

function handleConsent(choice) {
    setConsent(choice);
  }

function handleBanner(status) {
      setBannerstate(status);
    }

function getCookieValue(name) {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
          return decodeURIComponent(value);
        }
      }
      return null;
    }

  // 🌍 Fetch IP-based location
useEffect(() => {
    if (consent === 'accept') {
      fetch('https://ipapi.co/json')
        .then((res) => res.json())
        .then((data) => {
          setGeoData(data);

          const allInfo = {
            device: deviceDetails,
            geo: {
              ip: data.ip,
              city: data.city,
              country: data.country_name,
            },
          };

          // Save userInfo cookie
          document.cookie = `userInfo=${encodeURIComponent(
            JSON.stringify(allInfo)
          )}; path=/; max-age=31536000`;
          document.cookie = `consentState=${consent}; path=/; max-age=31536000`;
          document.cookie = `bannerState=${bannerstate ? "true" : "false"}; path=/; max-age=31536000`;

          setCookieInfo(allInfo);
        });
    } else if (consent === 'reject') {
      document.cookie = "userInfo=; path=/; max-age=0";
      document.cookie = "backgroundColor=; path=/; max-age=0";
      document.cookie = `consentState=${consent}; path=/; max-age=31536000`;
      document.cookie = `bannerState=${bannerstate ? "true" : "false"}; path=/; max-age=31536000`;
      setCookieInfo(null);

    } else {
      setCookieInfo(null);

    }
  }, [consent, bannerstate]);

  // 🍪 Set or clear backgroundColor cookie when selectedOption or consent changes
  useEffect(() => {
    if (consent === 'accept' && selectedOption) {
      document.cookie = `backgroundColor=${selectedOption}; path=/; max-age=31536000`;
    } else {
      document.cookie = "backgroundColor=; path=/; max-age=0";
    }
  }, [consent, selectedOption]);

useEffect(() => {
  const savedConsent = getCookieValue("consentState");
  const savedBannerState = getCookieValue("bannerState");

  if (savedConsent) setConsent(savedConsent);
  if (savedBannerState === "true") setBannerstate(true);
  else if (savedBannerState === "false") setBannerstate(false);

  setLoaded(true);
}, []);


let colorChange;
let content;
colorChange = <div><DropDown selectedOption={selectedOption} handleChange={handleChange} /></div>;


let ipdetail = null;


if (consent === 'null') {
  ipdetail = (
    <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f9f9f9", color: "#555" }}>
      <p>Consent not provided yet.</p>
    </div>
  );
} else if (consent === 'reject') {
  ipdetail = (
    <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#ffe6e6", color: "#cc0000" }}>
      <p><strong>You have rejected consent, so cookies have been deleted and no personal info is fetched.</strong></p>
    </div>
  );
} else if (cookieInfo) {
  ipdetail = (
    <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0" }}>
      <p><strong>🔐 PI Fetched from Cookie:</strong></p>
      <p>📍 IP: {cookieInfo.geo?.ip}</p>
      <p>🏙️ Location: {cookieInfo.geo?.city}, {cookieInfo.geo?.country}</p>
      <p>🖥️ User Agent: {cookieInfo.device?.userAgent}</p>
      <p>💻 Platform: {cookieInfo.device?.platform}</p>
      <p>🌐 Language: {cookieInfo.device?.language}</p>
      <p>📏 Resolution: {cookieInfo.device?.screenResolution}</p>
    </div>
  );
}


content = <div><MyApp consent={consent}  selectedOption ={selectedOption}/><CookieBanner consent={consent} bannerstate={bannerstate} handleConsent={handleConsent} handleBanner={handleBanner} loaded={loaded}/>{colorChange}<FloatingButton consent={consent} bannerstate={bannerstate} handleConsent={handleConsent} handleBanner={handleBanner}/>{ipdetail}</div>;


  return (
    <div>
      {content}
    </div>
  );
}
