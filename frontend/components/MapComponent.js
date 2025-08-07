import { MapContainer, TileLayer, Polygon, Rectangle, Marker, Popup } from 'react-leaflet';
import { Building, Trees, Car } from 'lucide-react';

// This component renders the interactive map using react-leaflet.
// It takes the current plan data as props and visualizes it.

const MapComponent = ({ planData }) => {
  if (!planData || !planData.cityBoundary) {
    // Render a placeholder if no data is available yet
    return (
      <div className="w-full h-full bg-brand-gray flex items-center justify-center rounded-xl">
        <p className="text-gray-500">Awaiting urban plan data...</p>
      </div>
    );
  }

  const { cityBoundary, greenSpaces, commercialZones, residentialZones, keyBuildings } = planData;
  const center = cityBoundary[0]; // Simple centering logic

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
      {/* Base map layer from OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Visualize City Boundary */}
      {cityBoundary && <Polygon pathOptions={{ color: 'black', weight: 2 }} positions={cityBoundary} />}

      {/* Visualize Green Spaces */}
      {greenSpaces.map((space, index) => (
        <Rectangle key={`green-${index}`} bounds={space.bounds} pathOptions={{ color: '#22c55e', fillColor: '#86efac', fillOpacity: 0.6 }}>
          <Popup>
            <div className="flex items-center space-x-2">
              <Trees className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-bold">Proposed Green Space</p>
                <p>Area: {space.area} sqkm</p>
              </div>
            </div>
          </Popup>
        </Rectangle>
      ))}

      {/* Visualize Commercial Zones */}
      {commercialZones.map((zone, index) => (
        <Rectangle key={`comm-${index}`} bounds={zone.bounds} pathOptions={{ color: '#f97316', fillColor: '#fdba74', fillOpacity: 0.6 }}>
           <Popup>
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-bold">Commercial Zone</p>
                <p>Type: {zone.type}</p>
              </div>
            </div>
          </Popup>
        </Rectangle>
      ))}
      
      {/* Visualize Residential Zones */}
      {residentialZones.map((zone, index) => (
        <Rectangle key={`res-${index}`} bounds={zone.bounds} pathOptions={{ color: '#3b82f6', fillColor: '#93c5fd', fillOpacity: 0.6 }}>
           <Popup>
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-bold">Residential Zone</p>
                <p>Density: {zone.density}</p>
              </div>
            </div>
          </Popup>
        </Rectangle>
      ))}


      {/* Visualize Key Buildings */}
      {keyBuildings.map((building, index) => (
        <Marker key={`bldg-${index}`} position={building.location}>
          <Popup>
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-gray-700" />
              <div>
                <p className="font-bold">{building.type}</p>
                <p>ID: {building.id}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
