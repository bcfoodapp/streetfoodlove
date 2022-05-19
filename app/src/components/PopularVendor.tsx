//with query
import React, { useEffect, useState } from "react";
import { usePopularVendorQuery, PopularVendor } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function PopularVendor() {
  const { data: popularVendor } = usePopularVendorQuery();
  const [vendorByArea, setVendorByArea] = useState([] as any);
  useEffect(() => {
    if (popularVendor) {
      let temp = [] as PopularVendor[];
      for (const Vendor of popularVendor) {
        let obj = {
          TotalRatings: Vendor.TotalRatings,
          BusinessName: Vendor.BusinessName,
          Location: Vendor.Location,
        };

        temp.push(obj);
      }

      setVendorByArea(temp);
    }
  }, [popularVendor]);

  console.log(vendorByArea);

  return (
    <BarChart
      width={600}
      height={400}
      data={popularVendor}
      layout={"vertical"}
      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
    >
      <XAxis type={"number"} />
      <YAxis type="category" dataKey="BusinessName" />
      <Tooltip />
      <Legend />
      <Bar dataKey={"TotalRatings"} fill="#FF6347" />
      <Bar dataKey="Location" fill="#FFA500" />
    </BarChart>
  );
}
