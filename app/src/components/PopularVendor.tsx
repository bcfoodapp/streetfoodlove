import { useEffect, useState } from "react";
import { usePopularVendorQuery } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function PopularVendor() {
  const { data: area } = usePopularVendorQuery();
  const [vendorByArea, setVendorByArea] = useState([] as any);

  useEffect(() => {
    if (area) {
      let obj = {
        ID: "30f15697-8c12-41cf-83d9-a9ccfe07c43e",
        name: "Areas",
        /* "Fish Taco": area.BusinessName,
                "Bellevue": area.AreaName,
                "TotalRating": area.One,*/
      };

      setVendorByArea([obj]);
    }
  }, [area]);

  return (
    <BarChart width={800} height={500} data={vendorByArea}>
      /* <CartesianGrid strokeDasharray="3 3" />
      */
      <XAxis dataKey="Name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Name" fill="#FF6347" width={1} />
      <Bar dataKey="Name" fill="#0000FF" />
      <Bar dataKey="Name" fill="#FF00FF" />
      <Bar dataKey="Name" fill="#4B0082" />
      <Bar dataKey="Name" fill="#FFA500" />
    </BarChart>
  );
}
