
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

const apiKey = process.env.OTD_API_KEY;

if (!apiKey) {
  throw new Error("Set the OTD_API_KEY environment variable first.");
}

const url = new URL(
  "https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb"
);
url.searchParams.set("key", apiKey);

const response = await fetch(url);

console.log("HTTP status:", response.status);
console.log("Content type:", response.headers.get("content-type"));

if (!response.ok) {
  console.error((await response.text()).slice(0, 500));
  process.exit(1);
}

const buffer = await response.arrayBuffer();

if (buffer.byteLength === 0) {
  throw new Error("The API returned an empty response.");
}

let feed;

try {
  feed =
    GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );
} catch {
  throw new Error(
    "Could not decode the response as GTFS-Realtime data."
  );
}

const entities = feed.entity ?? [];

const vehicles = entities.flatMap((entity) => {
  const vehicle = entity.vehicle;
  const position = vehicle?.position;

  if (!position) return [];

  return [{
    vehicleId: vehicle.vehicle?.id ?? null,
    routeId: vehicle.trip?.routeId ?? null,
    tripId: vehicle.trip?.tripId ?? null,
    latitude: position.latitude,
    longitude: position.longitude,
  }];
});

console.log("Total feed entities:", entities.length);
console.log("Vehicles with coordinates:", vehicles.length);
console.table(vehicles.slice(0, 20));
