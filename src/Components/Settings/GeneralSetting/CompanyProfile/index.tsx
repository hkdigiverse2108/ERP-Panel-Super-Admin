import { Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { CommonSwitch } from "../../../../Attribute";
import { ImagePath, ROUTES } from "../../../../Constants";
import { useAppSelector } from "../../../../Store/hooks";
import { CommonCard, CommonImageBox } from "../../../Common";

const CompanyProfile = () => {
  const { company = {} } = useAppSelector((state) => state.company);

  const CompanyDetails = [
    {
      title: "Basic Details",
      items: [
        { label: "Accounting Type", value: company?.accountingType },
        { label: "Name", value: company?.name },
        { label: "Display Name", value: company?.displayName },
        { label: "Contact Name", value: company?.contactName },
        { label: "Owner No", value: `+${company?.ownerNo?.countryCode} ${company?.ownerNo?.phoneNo}` },
        { label: "Support Email", value: company?.supportEmail },
        { label: "Email", value: company?.email },
        { label: "phone No", value: `+${company?.phoneNo?.countryCode} ${company?.phoneNo?.phoneNo}` },
        { label: "Customer Care No.", value: company?.customerCareNumber },
      ],
    },
    {
      title: "Communication Details",
      items: [
        { label: "Address", value: company?.address },
        { label: "City", value: company?.city },
        { label: "State", value: company?.state },
        { label: "Country", value: company?.country },
        { label: "Pin Code", value: company?.pinCode },
        { label: "Timezone", value: company?.timeZone },
        { label: "Web Site", value: company?.webSite },
      ],
    },
    {
      title: "Bank Details",
      items: [
        { label: "Bank Name", value: company?.bankName },
        { label: "Bank IFSC", value: company?.bankIFSC },
        { label: "UPI", value: company?.upiId },
        { label: "Branch Name", value: company?.branch },
        { label: "Account Holder Name", value: company?.accountHolderName },
        { label: "Bank Account No.", value: company?.bankAccountNumber },
      ],
    },
    {
      title: "Additional Details",
      items: [
        { label: "User Name", value: company?.userName },
        { label: "PAN No.", value: company?.PanNo },
        { label: "GST Registration Type", value: company?.GSTRegistrationType },
        { label: "GSTIN", value: company?.GSTIdentificationNumber },
        { label: "Financial Month Interval", value: company?.financialMonthInterval },
        { label: "Default Financial Year", value: company?.financialYear },
      ],
    },
    {
      title: "Other Details",
      items: [
        { label: "CIN No.", value: company?.corporateIdentificationNumber },
        { label: "LUT No.", value: company?.letterOfUndertaking },
        { label: "TAN No.", value: company?.taxDeductionAndCollectionAccountNumber },
        { label: "IEC No.", value: company?.importerExporterCode },
        { label: "Outlet Size (sq.ft.)", value: company?.outletSize },
        { label: "Decimal Point", value: company?.decimalPoint },
        { label: "Print Date Format", value: company?.printDateFormat },
      ],
    },
  ];

  const ImageItems = [
    { label: "Logo", src: company?.logo, alt: "Logo" },
    { label: "Watermark", src: company?.waterMark, alt: "waterMark" },
    { label: "Report Formats Logo", src: company?.reportFormatLogo, alt: "reportFormatLogo" },
    { label: "Authorised Signature", src: company?.authorizedSignature, alt: "authorizedSignature" },
  ];
  
  const topContent = (
    <Grid size="auto">
      <Link to={ROUTES.COMPANY.EDIT}>
        <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
          <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill="" />
          </svg>
          Edit
        </button>
      </Link>
    </Grid>
  );

  return (
    <Grid container spacing={2}>
      {CompanyDetails.map((section,index) => (
        <CommonCard key={section.title} title={section.title} topContent={index === 0 && topContent} grid={{ xs: 12 }}>
          <Grid sx={{ p: 2 }} container spacing={2}>
            {section.items.map((item, idx) => (
              <Grid key={idx} size={{ xs: 12, xsm: 6, xl: 3 }}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">{item.label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.value}</p>
              </Grid>
            ))}
          </Grid>
        </CommonCard>
      ))}

      <CommonCard title="logo" grid={{ xs: 12 }}>
        <Grid container spacing={2} className="p-4 overflow-auto ">
          {ImageItems.map((item, index) => (
            <CommonImageBox key={index} url={item.src || `${ImagePath}user/1.jpg`} label={item.label} type={"image"} grid={{ xs: 12, xsm: 6, xl: 3 }} />
          ))}
        </Grid>
      </CommonCard>

      <Grid size={12}>
        <CommonSwitch name="allowRoundOff" label="Allow RoundOff" value={company?.allowRoundOff === "true" || false} />
        <CommonSwitch name="enableFeedbackModule" label="Enable Feedback Module" value={company?.enableFeedbackModule === "true" || false} />
      </Grid>
    </Grid>
  );
};

export default CompanyProfile;
