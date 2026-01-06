export const CountryOptions = [{ label: "India", value: "India" }];

export const StateOptions = [
  { label: "Andhra Pradesh", value: "Andhra Pradesh", code: "AP", gstCode: "37" },
  { label: "Arunachal Pradesh", value: "Arunachal Pradesh", code: "AR", gstCode: "12" },
  { label: "Assam", value: "Assam", code: "AS", gstCode: "18" },
  { label: "Bihar", value: "Bihar", code: "BR", gstCode: "10" },
  { label: "Chhattisgarh", value: "Chhattisgarh", code: "CT", gstCode: "22" },
  { label: "Goa", value: "Goa", code: "GA", gstCode: "30" },
  { label: "Gujarat", value: "Gujarat", code: "GJ", gstCode: "24" },
  { label: "Haryana", value: "Haryana", code: "HR", gstCode: "06" },
  { label: "Himachal Pradesh", value: "Himachal Pradesh", code: "HP", gstCode: "02" },
  { label: "Jharkhand", value: "Jharkhand", code: "JH", gstCode: "20" },
  { label: "Karnataka", value: "Karnataka", code: "KA", gstCode: "29" },
  { label: "Kerala", value: "Kerala", code: "KL", gstCode: "32" },
  { label: "Madhya Pradesh", value: "Madhya Pradesh", code: "MP", gstCode: "23" },
  { label: "Maharashtra", value: "Maharashtra", code: "MH", gstCode: "27" },
  { label: "Manipur", value: "Manipur", code: "MN", gstCode: "14" },
  { label: "Meghalaya", value: "Meghalaya", code: "ML", gstCode: "17" },
  { label: "Mizoram", value: "Mizoram", code: "MZ", gstCode: "15" },
  { label: "Nagaland", value: "Nagaland", code: "NL", gstCode: "13" },
  { label: "Odisha", value: "Odisha", code: "OR", gstCode: "21" },
  { label: "Punjab", value: "Punjab", code: "PB", gstCode: "03" },
  { label: "Rajasthan", value: "Rajasthan", code: "RJ", gstCode: "08" },
  { label: "Sikkim", value: "Sikkim", code: "SK", gstCode: "11" },
  { label: "Tamil Nadu", value: "Tamil Nadu", code: "TN", gstCode: "33" },
  { label: "Telangana", value: "Telangana", code: "TS", gstCode: "36" },
  { label: "Tripura", value: "Tripura", code: "TR", gstCode: "16" },
  { label: "Uttar Pradesh", value: "Uttar Pradesh", code: "UP", gstCode: "09" },
  { label: "Uttarakhand", value: "Uttarakhand", code: "UK", gstCode: "05" },
  { label: "West Bengal", value: "West Bengal", code: "WB", gstCode: "19" },

  // Union Territories
  { label: "Delhi", value: "Delhi", code: "DL", gstCode: "07" },
  { label: "Jammu & Kashmir", value: "Jammu & Kashmir", code: "JK", gstCode: "01" },
  { label: "Ladakh", value: "Ladakh", code: "LA", gstCode: "38" },
  { label: "Puducherry", value: "Puducherry", code: "PY", gstCode: "34" },
  { label: "Chandigarh", value: "Chandigarh", code: "CH", gstCode: "04" },
  { label: "Andaman & Nicobar Islands", value: "Andaman & Nicobar Islands", code: "AN", gstCode: "35" },
  { label: "Dadra & Nagar Haveli and Daman & Diu", value: "DNHDD", code: "DN", gstCode: "26" },
  { label: "Lakshadweep", value: "Lakshadweep", code: "LD", gstCode: "31" },
];


export const CityOptionsByState: Record<string, { label: string; value: string }[]> = {
  "Andhra Pradesh": [
    { label: "Visakhapatnam", value: "Visakhapatnam" },
    { label: "Vijayawada", value: "Vijayawada" },
    { label: "Guntur", value: "Guntur" },
    { label: "Tirupati", value: "Tirupati" },
  ],

  "Arunachal Pradesh": [
    { label: "Itanagar", value: "Itanagar" },
    { label: "Naharlagun", value: "Naharlagun" },
  ],

  Assam: [
    { label: "Guwahati", value: "Guwahati" },
    { label: "Dibrugarh", value: "Dibrugarh" },
    { label: "Silchar", value: "Silchar" },
  ],

  Bihar: [
    { label: "Patna", value: "Patna" },
    { label: "Gaya", value: "Gaya" },
    { label: "Bhagalpur", value: "Bhagalpur" },
  ],

  Chhattisgarh: [
    { label: "Raipur", value: "Raipur" },
    { label: "Bilaspur", value: "Bilaspur" },
    { label: "Durg", value: "Durg" },
  ],

  Goa: [
    { label: "Panaji", value: "Panaji" },
    { label: "Margao", value: "Margao" },
    { label: "Vasco da Gama", value: "Vasco da Gama" },
  ],

  Gujarat: [
    { label: "Ahmedabad", value: "Ahmedabad" },
    { label: "Surat", value: "Surat" },
    { label: "Vadodara", value: "Vadodara" },
    { label: "Rajkot", value: "Rajkot" },
    { label: "Bhavnagar", value: "Bhavnagar" },
    { label: "Junagadh", value: "Junagadh" },
  ],

  Haryana: [
    { label: "Gurgaon", value: "Gurgaon" },
    { label: "Faridabad", value: "Faridabad" },
    { label: "Panipat", value: "Panipat" },
  ],

  "Himachal Pradesh": [
    { label: "Shimla", value: "Shimla" },
    { label: "Mandi", value: "Mandi" },
    { label: "Solan", value: "Solan" },
  ],

  Jharkhand: [
    { label: "Ranchi", value: "Ranchi" },
    { label: "Jamshedpur", value: "Jamshedpur" },
    { label: "Dhanbad", value: "Dhanbad" },
  ],

  Karnataka: [
    { label: "Bengaluru", value: "Bengaluru" },
    { label: "Mysuru", value: "Mysuru" },
    { label: "Mangaluru", value: "Mangaluru" },
    { label: "Hubli", value: "Hubli" },
  ],

  Kerala: [
    { label: "Thiruvananthapuram", value: "Thiruvananthapuram" },
    { label: "Kochi", value: "Kochi" },
    { label: "Kozhikode", value: "Kozhikode" },
  ],

  "Madhya Pradesh": [
    { label: "Bhopal", value: "Bhopal" },
    { label: "Indore", value: "Indore" },
    { label: "Gwalior", value: "Gwalior" },
  ],

  Maharashtra: [
    { label: "Mumbai", value: "Mumbai" },
    { label: "Pune", value: "Pune" },
    { label: "Nagpur", value: "Nagpur" },
    { label: "Nashik", value: "Nashik" },
    { label: "Aurangabad", value: "Aurangabad" },
  ],

  Manipur: [{ label: "Imphal", value: "Imphal" }],

  Meghalaya: [{ label: "Shillong", value: "Shillong" }],

  Mizoram: [{ label: "Aizawl", value: "Aizawl" }],

  Nagaland: [
    { label: "Kohima", value: "Kohima" },
    { label: "Dimapur", value: "Dimapur" },
  ],

  Odisha: [
    { label: "Bhubaneswar", value: "Bhubaneswar" },
    { label: "Cuttack", value: "Cuttack" },
    { label: "Rourkela", value: "Rourkela" },
  ],

  Punjab: [
    { label: "Chandigarh", value: "Chandigarh" },
    { label: "Ludhiana", value: "Ludhiana" },
    { label: "Amritsar", value: "Amritsar" },
  ],

  Rajasthan: [
    { label: "Jaipur", value: "Jaipur" },
    { label: "Jodhpur", value: "Jodhpur" },
    { label: "Udaipur", value: "Udaipur" },
    { label: "Kota", value: "Kota" },
    { label: "Ajmer", value: "Ajmer" },
  ],

  Sikkim: [{ label: "Gangtok", value: "Gangtok" }],

  "Tamil Nadu": [
    { label: "Chennai", value: "Chennai" },
    { label: "Coimbatore", value: "Coimbatore" },
    { label: "Madurai", value: "Madurai" },
    { label: "Trichy", value: "Trichy" },
  ],

  Telangana: [
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Warangal", value: "Warangal" },
  ],

  Tripura: [{ label: "Agartala", value: "Agartala" }],

  "Uttar Pradesh": [
    { label: "Lucknow", value: "Lucknow" },
    { label: "Noida", value: "Noida" },
    { label: "Ghaziabad", value: "Ghaziabad" },
    { label: "Kanpur", value: "Kanpur" },
    { label: "Agra", value: "Agra" },
  ],

  Uttarakhand: [
    { label: "Dehradun", value: "Dehradun" },
    { label: "Haridwar", value: "Haridwar" },
  ],

  "West Bengal": [
    { label: "Kolkata", value: "Kolkata" },
    { label: "Howrah", value: "Howrah" },
    { label: "Durgapur", value: "Durgapur" },
  ],

  // Union Territories
  Delhi: [
    { label: "New Delhi", value: "New Delhi" },
    { label: "Dwarka", value: "Dwarka" },
    { label: "Rohini", value: "Rohini" },
  ],

  "Jammu & Kashmir": [
    { label: "Srinagar", value: "Srinagar" },
    { label: "Jammu", value: "Jammu" },
  ],

  Ladakh: [{ label: "Leh", value: "Leh" }],

  Puducherry: [{ label: "Puducherry", value: "Puducherry" }],

  Chandigarh: [{ label: "Chandigarh", value: "Chandigarh" }],

  "Andaman & Nicobar Islands": [{ label: "Port Blair", value: "Port Blair" }],

  DNHDD: [
    { label: "Silvassa", value: "Silvassa" },
    { label: "Daman", value: "Daman" },
  ],

  Lakshadweep: [{ label: "Kavaratti", value: "Kavaratti" }],
};

export const TimeZoneOptions: Record<string, { label: string; value: string }[]> = { India: [{ label: "Chennai, Kolkata, Mumbai, New Delhi (UTC+05:30)", value: "Asia/Kolkata" }] };
