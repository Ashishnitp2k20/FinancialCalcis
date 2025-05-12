import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const gstTypes = [
  {
    type: 'CGST',
    fullName: 'Central Goods and Services Tax',
    description:
      'Collected by the central government for intra-state supply of goods and services and is governed by the CGST act. CGST is charged along with SGST with both rates usually equal.',
  },
  {
    type: 'SGST',
    fullName: 'State Goods and Services Tax',
    description:
      'Collected by the state government for intra-state supply of goods and services and is governed by the SGST act. SGST is charged along with CGST with both rates usually equal.',
  },
  {
    type: 'IGST',
    fullName: 'Integrated Goods and Services Tax',
    description:
      'Collected by the central government on inter-state supply of goods and services as well as imports. The central government collects the IGST and then distributes it among the respective states.',
  },
  {
    type: 'UTGST',
    fullName: 'Union Territory Goods and Services Tax',
    description:
      'Applicable on supply of goods or services that take place in any of the seven union territories in India. The UTGST is collected along with the CGST.',
  },
];

const GstTypesTable = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 mt-4">
      {gstTypes.map((gst) => (
        <Card key={gst.type} className="border border-gst-light-purple/40 shadow-sm">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gst-secondary-purple text-lg">{gst.type}</span>
              <span className="font-semibold text-gray-800">{gst.fullName}</span>
            </div>
            <div className="text-gray-700 text-sm mt-2">{gst.description}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GstTypesTable; 