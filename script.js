const { useState, useEffect } = React;

function LostAndFoundApp() {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState("");
    const [dateLost, setDateLost] = useState("");
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [map, setMap] = useState(null);

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle Google Maps click event
   const handleMapClick = (event) => {
       setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    };

   // Initialize Google Maps
    useEffect(() => {
        const initMap = () => {
            const newMap = new google.maps.Map(document.getElementById("map"), {
                center: { lat: -1.286389, lng: 36.817223 }, // Default to Nairobi
                zoom: 12,
            });

            newMap.addListener("click", handleMapClick);
            setMap(newMap);
     };

        if (!map) initMap();
    }, []);

    const addLostItem = (e) => {
        e.preventDefault();
        if (!itemName || !dateLost) return;
        setItems([...items, { itemName, dateLost, image, location }]);
        setItemName("");
        setDateLost("");
        setImage(null);
        setLocation(null);
    };

    return (
        <div>
            <h2>Report Lost Item</h2>
            <form className="lost-item-form" onSubmit={addLostItem}>
                <input 
                    type="text" 
                    placeholder="Item Name" 
                    value={itemName} 
                    onChange={(e) => setItemName(e.target.value)} 
                    required 
                />
                <input 
                    type="date" 
                    value={dateLost} 
                    onChange={(e) => setDateLost(e.target.value)} 
                    required 
                />
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                />
                {image && <img src={image} alt="Preview" className="image-preview" />}
                <button type="submit">Post Item</button>
            </form>

            <div className="lost-item-list">
                <h2>Lost Items</h2>
                {items.length === 0 ? <p>No lost items reported.</p> : (
                    <ul>
                        {items.map((item, index) => (
                            <li key={index}>
                                <strong>{item.itemName}</strong> - {item.dateLost}
                                {item.image && <img src={item.image} alt="Lost Item" className="image-preview" />}
                                {item.location && (
                                    <p>Location: {item.location.lat.toFixed(5)}, {item.location.lng.toFixed(5)}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

// Render the React component into the HTML page
ReactDOM.render(<LostAndFoundApp />, document.getElementById("lost-items-app"));
