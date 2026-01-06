import { Box } from "@mui/material";

const ContactLayout = () => {
  // const navigate = useNavigate();
  // const location = useLocation();

  // const [contactType, setContactType] = useState(
  //   location.state?.type || "customer"
  // );

  // const handleChange = (e) => {
  //   const type = e.target.value;
  //   setContactType(type);

    
  //   navigate("/contacts", { state: { type } });
  // };

  return (
    <Box>
     
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          p: 2,
        }}
      >
        {/* <RadioGroup row value={contactType} onChange={handleChange}>
          <FormControlLabel value="customer" control={<Radio />} label="Customer" />
          <FormControlLabel value="vendor" control={<Radio />} label="Vendor / Supplier" />
          <FormControlLabel value="transport" control={<Radio />} label="Transport" />
        </RadioGroup> */}
      </Box>

     
      {/* <Outlet context={{ contactType }} /> */}
    </Box>
  );
};

export default ContactLayout;
