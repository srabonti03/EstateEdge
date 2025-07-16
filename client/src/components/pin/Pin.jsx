import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item }) {
  const imageSrc = item.images?.[0]
    ? item.images[0].startsWith("http")
      ? item.images[0]
      : `http://localhost:3000${item.images[0]}`
    : "/fallback-property.png";

  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <img src={imageSrc} alt={item.title || "Property Image"} />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>TK {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
