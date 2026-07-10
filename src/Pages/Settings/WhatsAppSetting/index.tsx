import { WhatsApp, MessageRounded, SyncRounded, Visibility, Delete, Receipt } from "@mui/icons-material";
import { Box, Button, Grid, Tab, Tabs, TextField, Typography, Chip, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip } from "@mui/material";
import { useState, useMemo, type SyntheticEvent } from "react";
import { CommonBreadcrumbs } from "../../../Components/Common";
import { PAGE_TITLE } from "../../../Constants";
import { BREADCRUMBS } from "../../../Data";
import { Queries, Mutations } from "../../../Api";
import type { MetaWhatsAppAccount, MetaTemplate, MetaTemplateComponent, MetaMessageLog } from "../../../Types";

const SAMPLE_BODIES: Record<string, string> = {
  POS_BILL: "Hello {{1}}, your order ({{2}}) of Rs.{{3}} is confirmed. Thank you for your business!",
  CONTACT_BULK: "Hello {{1}}, thank you for being our valued customer!",
  INVOICE: "Dear {{1}}, your invoice {{2}} of Rs.{{3}} is ready. Due date: {{4}}.",
  CUSTOM: "",
};

const AccountTab = ({ companyFilter }: { companyFilter: string }) => {
  const { data: accountsData, isLoading, refetch } = Queries.useGetMetaWhatsAppAccounts();
  const { data: companyData } = Queries.useGetCompanyDropdown();
  const upsertAccount = Mutations.useUpsertMetaWhatsAppAccount();
  const allAccounts: MetaWhatsAppAccount[] = accountsData?.data || [];
  const companies = companyData?.data || [];

  const accounts = useMemo(() => {
    if (!companyFilter) return allAccounts;
    return allAccounts.filter((a) => a.companyId === companyFilter);
  }, [allAccounts, companyFilter]);

  const getCompanyName = (id?: string) => {
    if (!id) return "-";
    const c = companies.find((c: any) => c._id === id);
    return c?.displayName || c?.name || id;
  };

  const [form, setForm] = useState({ companyId: "", branchId: "", businessAccountId: "", phoneNumberId: "", displayPhoneNumber: "", accessToken: "", graphVersion: "v23.0" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: branchData } = Queries.useGetBranchDropdown({ companyFilter: form.companyId }, Boolean(form.companyId));
  const branches = branchData?.data || [];

  const handleSave = () => {
    const payload: any = { ...form };
    if (!payload.branchId) delete payload.branchId;
    if (editingId) payload.accountId = editingId;
    upsertAccount.mutate(payload, { onSuccess: () => { setForm({ companyId: "", branchId: "", businessAccountId: "", phoneNumberId: "", displayPhoneNumber: "", accessToken: "", graphVersion: "v23.0" }); setEditingId(null); refetch(); } });
  };

  const handleEdit = (acc: MetaWhatsAppAccount) => {
    const cId = typeof acc.companyId === "object" ? (acc.companyId as any)._id : acc.companyId || "";
    const bId = typeof acc.branchId === "object" ? (acc.branchId as any)._id : acc.branchId || "";
    setForm({ companyId: cId, branchId: bId, businessAccountId: acc.businessAccountId, phoneNumberId: acc.phoneNumberId, displayPhoneNumber: acc.displayPhoneNumber || "", accessToken: acc.accessToken, graphVersion: acc.graphVersion || "v23.0" });
    setEditingId(acc._id || null);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>{editingId ? "Edit Account" : "Add WhatsApp Business Account"}</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Company</InputLabel>
                <Select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value, branchId: "" })} label="Company">
                  {companies.map((c: any) => <MenuItem key={c._id} value={c._id}>{c.displayName || c.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Branch (optional)</InputLabel>
                <Select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} label="Branch (optional)" disabled={!form.companyId}>
                  <MenuItem value="">None</MenuItem>
                  {branches.map((b: any) => <MenuItem key={b._id} value={b._id}>{b.displayName || b.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Business Account ID" value={form.businessAccountId} onChange={(e) => setForm({ ...form, businessAccountId: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Phone Number ID" value={form.phoneNumberId} onChange={(e) => setForm({ ...form, phoneNumberId: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Display Phone Number" value={form.displayPhoneNumber} onChange={(e) => setForm({ ...form, displayPhoneNumber: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Access Token" type="password" value={form.accessToken} onChange={(e) => setForm({ ...form, accessToken: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Graph API Version" value={form.graphVersion} onChange={(e) => setForm({ ...form, graphVersion: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="contained" startIcon={<WhatsApp />} onClick={handleSave} disabled={upsertAccount.isPending || !form.companyId}>
                {upsertAccount.isPending ? "Saving..." : editingId ? "Update Account" : "Add Account"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {accounts.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>No WhatsApp accounts configured.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Business Account ID</TableCell>
                <TableCell>Phone Number ID</TableCell>
                <TableCell>Display Number</TableCell>
                <TableCell>Graph Version</TableCell>
                <TableCell>Last Synced</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((row) => {
                const rowCompanyId = typeof row.companyId === "object" ? (row.companyId as any)._id : row.companyId;
                return (
                  <TableRow key={row._id}>
                    <TableCell>{getCompanyName(rowCompanyId)}</TableCell>
                    <TableCell>{row.businessAccountId}</TableCell>
                    <TableCell>{row.phoneNumberId}</TableCell>
                    <TableCell>{row.displayPhoneNumber || "-"}</TableCell>
                    <TableCell>{row.graphVersion || "v23.0"}</TableCell>
                    <TableCell>{row.lastTemplateSyncAt ? new Date(row.lastTemplateSyncAt).toLocaleString() : "Never"}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleEdit(row)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

const TemplateViewDialog = ({ open, template, onClose }: { open: boolean; template: MetaTemplate | null; onClose: () => void }) => {
  if (!template) return null;

  const renderComponent = (comp: MetaTemplateComponent, idx: number) => (
    <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
      <Typography variant="caption" fontWeight="bold" color="primary">{comp.type}</Typography>
      {comp.text && <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>{comp.text}</Typography>}
      {comp.example ? <Typography variant="caption" color="text.secondary" display="block">Example: {String(JSON.stringify(comp.example))}</Typography> : null}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Template Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Name</Typography><Typography variant="body2">{template.name}</Typography></Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Status</Typography><Chip label={template.status} color={template.status === "APPROVED" ? "success" : template.status === "REJECTED" ? "error" : "warning"} size="small" /></Grid>
          <Grid size={4}><Typography variant="caption" color="text.secondary">Language</Typography><Typography variant="body2">{template.language}</Typography></Grid>
          <Grid size={4}><Typography variant="caption" color="text.secondary">Category</Typography><Typography variant="body2">{template.category}</Typography></Grid>
          <Grid size={4}><Typography variant="caption" color="text.secondary">Use For</Typography><Typography variant="body2">{template.useFor}</Typography></Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Meta Template ID</Typography><Typography variant="body2">{template.metaTemplateId || "-"}</Typography></Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Account</Typography><Typography variant="body2">{typeof template.accountId === "object" ? (template.accountId as any).displayPhoneNumber || (template.accountId as any).phoneNumberId || "-" : template.accountId || "-"}</Typography></Grid>
          {template.rejectionReason && <Grid size={12}><Typography variant="caption" color="error">Rejection Reason</Typography><Typography variant="body2" color="error">{template.rejectionReason}</Typography></Grid>}
        </Grid>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Components</Typography>
        {template.components?.map((c, i) => renderComponent(c, i))}
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
};

const ConfirmDeleteDialog = ({ open, templateName, onConfirm, onClose, isDeleting }: { open: boolean; templateName: string; onConfirm: () => void; onClose: () => void; isDeleting: boolean }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>Delete Template</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete template <strong>{templateName}</strong>? This action cannot be undone.</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={isDeleting}>Cancel</Button>
      <Button variant="contained" color="error" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete"}</Button>
    </DialogActions>
  </Dialog>
);

const TemplatesTab = () => {
  const { data: templatesData, isLoading, refetch } = Queries.useGetMetaWhatsAppTemplates();
  const { data: accountsData } = Queries.useGetMetaWhatsAppAccounts();
  const { data: companyData } = Queries.useGetCompanyDropdown();
  const createTemplate = Mutations.useCreateMetaWhatsAppTemplate();
  const syncTemplates = Mutations.useSyncMetaWhatsAppTemplates();
  const deleteTemplate = Mutations.useDeleteMetaWhatsAppTemplate();

  const accounts: MetaWhatsAppAccount[] = accountsData?.data || [];
  const companies = companyData?.data || [];
  const templates = templatesData?.data?.template_data || [];

  const getCompanyName = (id?: string) => {
    if (!id) return "Global";
    const c = companies.find((c: any) => c._id === id);
    return c?.displayName || c?.name || id;
  };

  const initialState = { branchId: "", accountId: "", name: "", language: "en_US", category: "UTILITY", useFor: "CUSTOM", bodyText: "", sendAttachment: false, attachmentType: "pdf", companyId: "" };
  const [form, setForm] = useState(initialState);
  const [showForm, setShowForm] = useState(false);
  const [viewTemplate, setViewTemplate] = useState<MetaTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MetaTemplate | null>(null);

  const filteredAccounts = useMemo(() => {
    if (!form.companyId) return accounts;
    return accounts.filter((a: any) => {
      const aCompanyId = typeof a.companyId === "object" && a.companyId ? (a.companyId as any)._id : a.companyId;
      return aCompanyId === form.companyId;
    });
  }, [accounts, form.companyId]);

  const handleCreate = () => {
    const components = [{ type: "BODY", text: form.bodyText }];
    const payload: any = { accountId: form.accountId, name: form.name, language: form.language, category: form.category as any, useFor: form.useFor as any, components, sendAttachment: form.sendAttachment, attachmentType: form.attachmentType, companyId: form.companyId || undefined };
    if (form.branchId) payload.branchId = form.branchId;
    createTemplate.mutate(payload, { onSuccess: () => { setShowForm(false); setForm({ ...initialState }); refetch(); } });
  };

  const handleCancel = () => {
    setForm({ ...initialState });
    setShowForm(false);
  };

  const handleUseForChange = (useFor: string) => {
    setForm({ ...form, useFor, bodyText: SAMPLE_BODIES[useFor] || "", sendAttachment: false });
  };

  const handleDelete = () => {
    if (!deleteTarget?._id) return;
    deleteTemplate.mutate(deleteTarget._id, { onSuccess: () => { setDeleteTarget(null); refetch(); } });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
        {!showForm && <Button variant="contained" onClick={() => setShowForm(true)}>Create Template</Button>}
        <Button variant="outlined" startIcon={<SyncRounded />} onClick={() => syncTemplates.mutate(undefined as any, { onSuccess: () => refetch() })}>Sync from Meta</Button>
      </Box>

      {showForm && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Create WhatsApp Template</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Company</InputLabel>
                  <Select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value, accountId: "" })} label="Company">
                    <MenuItem value="">All Companies (Global)</MenuItem>
                    {companies.map((c: any) => <MenuItem key={c._id} value={c._id}>{c.displayName || c.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>WhatsApp Account</InputLabel>
                  <Select value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })} label="WhatsApp Account">
                    {filteredAccounts.map((a: any) => {
                      const companyName = typeof a.companyId === "object" && a.companyId ? (a.companyId as any).displayName || (a.companyId as any).name || "" : "";
                      return <MenuItem key={a._id} value={a._id}>{a.displayPhoneNumber || a.phoneNumberId}{companyName ? ` (${companyName})` : ""}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Template Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} helperText="Only lowercase letters, numbers, and underscores allowed" />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Language (e.g. en_US)" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} label="Category">
                    <MenuItem value="UTILITY">Utility</MenuItem>
                    <MenuItem value="MARKETING">Marketing</MenuItem>
                    <MenuItem value="AUTHENTICATION">Authentication</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Use For</InputLabel>
                  <Select value={form.useFor} onChange={(e) => handleUseForChange(e.target.value)} label="Use For">
                    <MenuItem value="POS_BILL">POS Bill</MenuItem>
                    <MenuItem value="CONTACT_BULK">Contact Bulk</MenuItem>
                    <MenuItem value="INVOICE">Invoice</MenuItem>
                    <MenuItem value="CUSTOM">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth multiline rows={4} label="Body Text" value={form.bodyText} onChange={(e) => setForm({ ...form, bodyText: e.target.value })} />
              </Grid>
              {form.useFor && SAMPLE_BODIES[form.useFor] && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info" sx={{ "& .MuiAlert-message": { width: "100%" } }}>
                    <Typography variant="caption" fontWeight={600}>Available variables for {form.useFor}:</Typography>
                    {form.useFor === "POS_BILL" && <Typography variant="caption" display="block">{`{{1}} = Customer Name, {{2}} = Order No., {{3}} = Total Amount`}</Typography>}
                    {form.useFor === "CONTACT_BULK" && <Typography variant="caption" display="block">{`{{1}} = Customer Name`}</Typography>}
                    {form.useFor === "INVOICE" && <Typography variant="caption" display="block">{`{{1}} = Customer Name, {{2}} = Invoice No., {{3}} = Amount, {{4}} = Due Date`}</Typography>}
                  </Alert>
                </Grid>
              )}
              {(form.useFor === "POS_BILL" || form.useFor === "INVOICE") && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControlLabel control={<Checkbox checked={form.sendAttachment} onChange={(e) => setForm({ ...form, sendAttachment: e.target.checked })} />} label={`Send ${form.useFor === "POS_BILL" ? "Bill PDF" : "Invoice PDF"} as attachment`} />
                  </Grid>
                  {form.sendAttachment && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Attachment Type</InputLabel>
                        <Select value={form.attachmentType} onChange={(e) => setForm({ ...form, attachmentType: e.target.value })} label="Attachment Type">
                          <MenuItem value="pdf">PDF Document</MenuItem>
                          <MenuItem value="image">Image</MenuItem>
                          <MenuItem value="document">Document (DOCX/XLSX)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </>
              )}
              <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 1 }}>
                <Button variant="contained" onClick={handleCreate} disabled={createTemplate.isPending || !form.accountId || !form.name || !form.bodyText}>
                  {createTemplate.isPending ? "Submitting..." : "Submit Template to Meta"}
                </Button>
                <Button variant="outlined" color="error" onClick={handleCancel}>Cancel</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>No templates found. Create or sync templates.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Use For</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((row: MetaTemplate) => {
                const tplCompanyId = typeof row.companyId === "object" ? (row.companyId as any)._id : row.companyId;
                return (
                  <TableRow key={row._id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{getCompanyName(tplCompanyId)}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color={row.status === "APPROVED" ? "success" : row.status === "REJECTED" ? "error" : "warning"} size="small" />
                    </TableCell>
                    <TableCell>{row.language}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.useFor}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View"><IconButton size="small" onClick={() => setViewTemplate(row)}><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}><Delete fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TemplateViewDialog open={!!viewTemplate} template={viewTemplate} onClose={() => setViewTemplate(null)} />
      <ConfirmDeleteDialog open={!!deleteTarget} templateName={deleteTarget?.name || ""} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} isDeleting={deleteTemplate.isPending} />
    </Box>
  );
};

const LogsTab = () => {
  const { data: logsData, isLoading } = Queries.useGetMetaWhatsAppLogs();

  const logs: MetaMessageLog[] = logsData?.data?.log_data || [];

  const getTemplateName = (tpl: any) => (typeof tpl === "object" && tpl ? tpl.name : tpl) || "-";

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      {logs.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>No message logs found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recipient</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Template</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Charge ($)</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Sent At</TableCell>
                <TableCell>Error</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.recipientName || "-"}</TableCell>
                  <TableCell>{row.recipientPhone || "-"}</TableCell>
                  <TableCell>{getTemplateName(row.templateId)}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color={row.status === "sent" ? "success" : row.status === "failed" ? "error" : row.status === "skipped" ? "default" : "warning"} size="small" />
                  </TableCell>
                  <TableCell>{row.billedAmount ?? (row.status === "sent" ? "0.005" : "0")}</TableCell>
                  <TableCell>{row.sourceType}</TableCell>
                  <TableCell>{row.sentAt ? new Date(row.sentAt).toLocaleString() : "-"}</TableCell>
                  <TableCell>{row.errorMessage ? <Typography variant="caption" color="error">{row.errorMessage}</Typography> : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

const WhatsAppSetting = () => {
  const [value, setValue] = useState(0);
  const [companyFilter, setCompanyFilter] = useState("");
  const { data: companyData } = Queries.useGetCompanyDropdown();
  const companies = companyData?.data || [];
  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.WHATSAPP.BASE} maxItems={1} breadcrumbs={(BREADCRUMBS as any).WHATSAPP?.BASE || [{ label: PAGE_TITLE.WHATSAPP.BASE }]} />
      <div className="m-4 md:m-6">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3, lg: 3, xl: 2 }}>
            <Box className="rounded-lg py-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
              <Tabs orientation="vertical" variant="scrollable" value={value} onChange={handleChange}>
                <Tab icon={<WhatsApp />} label="Account" value={0} iconPosition="start" className="capitalize" />
                <Tab icon={<MessageRounded />} label="Templates" value={1} iconPosition="start" className="capitalize" />
                <Tab icon={<Receipt />} label="Logs" value={2} iconPosition="start" className="capitalize" />
              </Tabs>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 9, lg: 9, xl: 10 }}>
            <Box className="rounded-lg p-4 bg-white dark:bg-gray-dark! border border-gray-200 dark:border-gray-800">
              <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ minWidth: 80 }}>Filter:</Typography>
                <FormControl size="small" sx={{ minWidth: 250 }}>
                  <InputLabel>Company</InputLabel>
                  <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} label="Company">
                    <MenuItem value="">All Companies</MenuItem>
                    {companies.map((c: any) => <MenuItem key={c._id} value={c._id}>{c.displayName || c.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              {value === 0 && <AccountTab companyFilter={companyFilter} />}
              {value === 1 && <TemplatesTab />}
              {value === 2 && <LogsTab />}
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default WhatsAppSetting;