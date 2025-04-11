import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Modal,
    Box,
    CircularProgress,
    Toolbar,
    InputBase,
    IconButton,
    useTheme,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
    ResponsiveContainer,
} from 'recharts';
import { visuallyHidden } from '@mui/utils';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import RefreshIcon from '@mui/icons-material/Refresh'; // Import RefreshIcon
import LoginHeader from './loginheader';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

// --- Sorting Functions ---
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// --- Table Header Component for Sorting ---
const headCells = [
    { id: 'originalUrl', numeric: false, disablePadding: false, label: 'Original URL' },
    { id: 'shortUrl', numeric: false, disablePadding: false, label: 'Shortened URL' },
    { id: 'createdAt', numeric: true, disablePadding: false, label: 'Created At' },
    // { id: 'clicks', numeric: true, disablePadding: false, label: 'Clicks' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <>
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
        </>
    );
}

// --- Table Pagination Actions Component ---
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: theme.spacing(2), // Added some spacing
    width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
        </Box>
    );
}

// --- Dashboard Component ---
const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [shortenedUrls, setShortenedUrls] = useState([]);
    const [selectedUrlAnalytics, setSelectedUrlAnalytics] = useState(null);
    const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Sorting state
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Search filter state
    const [filter, setFilter] = useState('');

    // Function to fetch dashboard data
    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDashboardData(data);
                setShortenedUrls(data.recentUrls || []);
                setLoading(false);
            } else if (response.status === 401) {
                setError('Unauthorized. Please log in again.');
                setLoading(false);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                navigate('/login');
            } else {
                setError('Failed to fetch dashboard data.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to connect to the server.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [navigate]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleViewAnalytics = async (shortUrlId) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:3000/api/urls/analytics/${shortUrlId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedUrlAnalytics(data);
                setIsAnalyticsModalOpen(true);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to fetch analytics for this URL.');
                setIsAnalyticsModalOpen(false);
            }
        } catch (error) {
            console.error('Error fetching URL analytics:', error);
            setError('Failed to connect to the server.');
            setIsAnalyticsModalOpen(false);
        }
    };

    const handleCloseAnalyticsModal = () => {
        setIsAnalyticsModalOpen(false);
        setSelectedUrlAnalytics(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setPage(0);
    };

    const handleRefreshTable = () => {
        fetchDashboardData();
    };

    const filteredUrls = useMemo(() => {
        return shortenedUrls.filter(url =>
            url.original_url?.toLowerCase().includes(filter.toLowerCase()) ||
            url.short_url?.toLowerCase().includes(filter.toLowerCase())
        );
    }, [shortenedUrls, filter]);

    const visibleRows = useMemo(
        () =>
            stableSort(filteredUrls, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, filteredUrls],
    );

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUrls.length) : 0;

    return (
        <>
        <LoginHeader/>
        <Container sx={{ mt: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            {/* Overview Metrics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <StyledPaper>
                        <Typography variant="h6">Total Shortened URLs</Typography>
                        <Typography variant="h5">{dashboardData?.urlCounts?.permanent + dashboardData?.urlCounts?.temporary || 0}</Typography>
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <StyledPaper>
                        <Typography variant="h6">Total Clicks</Typography>
                        <Typography variant="h5">{dashboardData?.totalClicks || 0}</Typography>
                    </StyledPaper>
                </Grid>
                {/* You can add more overview metrics here */}
            </Grid>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : !dashboardData ? (
                <Typography>No dashboard data available.</Typography>
            ) : (
                <StyledPaper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <StyledToolbar>
                        <Typography
                            sx={{ flex: '1 1 auto' }} // Grow to take available space
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            Your Recent URLs
                        </Typography>
                        <IconButton onClick={handleRefreshTable} aria-label="refresh">
                            <RefreshIcon />
                        </IconButton>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search URLs…"
                                inputProps={{ 'aria-label': 'search' }}
                                value={filter}
                                onChange={handleFilterChange}
                            />
                        </Search>
                    </StyledToolbar>
                    <TableContainer sx={{ flexGrow: 1 }}>
                        <Table aria-label="shortened URLs table" size="small">
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={filteredUrls.length}
                            />
                            <TableBody>
                                {visibleRows.map((url) => (
                                    <TableRow key={url.id}>
                                        <TableCell>{url.original_url}</TableCell>
                                        <TableCell>{`http://localhost:3000/${url.short_url}`}</TableCell>
                                        <TableCell align="right">{new Date(url.created_at).toLocaleDateString()}</TableCell>
                                        {/* <TableCell align="right">{url.clicks || 0}</TableCell> */}
                                        <TableCell>
                                            <Button size="small" onClick={() => handleViewAnalytics(url.short_url)}> {/* Use short_url as ID */}
                                                View Analytics
                                            </Button>
                                            <Button size="small" onClick={() => navigator.clipboard.writeText(`http://localhost:3000/${url.short_url}`)}>
                                                Copy
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 33 * emptyRows }}>
                                        <TableCell colSpan={5} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={5}
                        count={filteredUrls.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: {
                                'aria-label': 'rows per page',
                            },
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                        sx={{ mt: 'auto' }}
                    />
                </StyledPaper>
            )}

            {/* Analytics Modal */}
            <Modal
                open={isAnalyticsModalOpen}
                onClose={handleCloseAnalyticsModal}
                aria-labelledby="url-analytics-modal"
                aria-describedby="analytics for a specific shortened URL"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                        Analytics for {selectedUrlAnalytics?.shortUrl}
                    </Typography>

                    {selectedUrlAnalytics ? (
                        <>
                            <Typography variant="h6">Total Clicks: {selectedUrlAnalytics.totalClicks}</Typography>

                            {/* Clicks Over Time Chart */}
                            {selectedUrlAnalytics.clicksOverTime && selectedUrlAnalytics.clicksOverTime.length > 0 && (
                                <>
                                    <Typography variant="subtitle1">Clicks Over Time</Typography>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={selectedUrlAnalytics.clicksOverTime}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="timestamp" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </>
                            )}

                            {/* Top Locations */}
                            {selectedUrlAnalytics.topLocations && Object.keys(selectedUrlAnalytics.topLocations).length > 0 && (
                                <>
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Top Locations</Typography>
                                    {Object.entries(selectedUrlAnalytics.topLocations).map(([location, count]) => (
                                        <Typography key={location}>{location}: {count}</Typography>
                                    ))}
                                </>
                            )}

                            {/* Device Breakdown */}
                            {selectedUrlAnalytics.deviceBreakdown && Object.keys(selectedUrlAnalytics.deviceBreakdown).length > 0 && (
                                <>
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Device Breakdown</Typography>
                                    {Object.entries(selectedUrlAnalytics.deviceBreakdown).map(([device, count]) => (
                                        <Typography key={device}>{device}: {count}</Typography>
                                    ))}
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={Object.entries(selectedUrlAnalytics.deviceBreakdown).map(([name, value]) => ({ name, value }))}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </>
                            )}

                            {/* Browser Breakdown */}
                            {selectedUrlAnalytics.browserBreakdown && Object.keys(selectedUrlAnalytics.browserBreakdown).length > 0 && (
                                <>
                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Browser Breakdown</Typography>
                                    {Object.entries(selectedUrlAnalytics.browserBreakdown).map(([browser, count]) => (
                                        <Typography key={browser}>{browser}: {count}</Typography>
                                    ))}
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={Object.entries(selectedUrlAnalytics.browserBreakdown).map(([name, value]) => ({ name, value }))}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#ffc658" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </>
                            )}
                        </>
                    ) : (
                        <Typography>Loading analytics...</Typography>
                    )}

                    <Button onClick={handleCloseAnalyticsModal} sx={{ mt: 2 }}>Close</Button>
                </Box>
            </Modal>
        </Container>
        </>
    );

};

export default Dashboard;