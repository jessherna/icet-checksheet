import { useEffect, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {
    IconButton,
    Box,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import moment from 'moment';
//import io from 'socket.io-client';

const ChecksheetPage = () => {
    const [data, setData] = useState([]);
    //const socket = io('http://localhost:5000');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:5000/checksheet');
            const data = await response.json();
    
            // Access the data array and filter out the checked ones
            const uncheckedSheets = data.filter(sheet => !sheet.isChecked);
    
            // Map the data to a new format
            const mappedData = uncheckedSheets.map(sheet => ({
                id: sheet._id,
                day: sheet.day,
                lab: sheet.lab,
                startTime: moment(sheet.startTime, 'HH:mm:ss').format('hh:mm A'),
                checkedBy: sheet.checkedBy,
                actualTime: sheet.actualTime ? moment(sheet.actualTime).format('hh:mm A') : ""
            }));
    
            setData(mappedData);
        };
        fetchData();
    }, []);

    const handleCheck = async ({ id }) => {
        alert(`Checking sheet with id ${id}`);
    };

    const isSmallScreen = useMediaQuery({ query: '(max-width: 600px)' });

    const columns = useMemo(
        () => isSmallScreen ? [
            {
                accessorKey: 'lab',
                header: 'Lab',
                size: 30,
                filtervariant: 'select',
            },
            {
                accessorKey: 'startTime',
                header: 'Check Time',
                size: 50,
            },
        ] : [
            {
                accessorKey: 'lab',
                header: 'Lab',
                size: 30,
                filtervariant: 'select',
            },
            {
                accessorKey: 'startTime',
                header: 'Check Time',
                size: 50,
            },
            {
                accessorKey: 'day',
                header: 'Day',
                size: 20,
                filtervariant: 'select',
            },
            {
                accessorKey: 'checkedBy',
                header: 'Checked By',
                size: 30,
            },
            {
                accessorKey: 'actualTime',
                header: 'Actual Time',
                size: 30,
            },

        ],
        [isSmallScreen]
    );

    const table = useMaterialReactTable({
        columns: columns,
        data: data,
        density: 'compact',
        enableGrouping: false,
        enablePagination: false,
        enableRowSelection: true,
        initialState: {
            columnPinning: { right: ['mrt-row-actions'] },
            columnOrder: [
                'mrt-row-select', 
                'day',
                'lab',
                'startTime',
                'checkedBy',
            ],
            showColumnFilters: false,
            showColumnVisibilityManager: false,
            showDensitySelector: false,
            showGroupingControls: false,
            showRowSelector: false,
            showSearch: false,
            showSettings: false,
            showSummary: false,
            showTableSelector: false,
            showViewChanger: false,
        },
        enableRowActions: true,
        positionActionsColumn: 'last',
        muiTopToolbarProps: {
            sx: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0px',
                marginLeft: '5%',
                marginRight: '5%',
                fontFamily: 'Arial',
                button: {
                    fontSize: '1em',
                    borderRadius: '5px',
                },
            },
        },
        muiTableContainerProps: {
            sx: {
                marginTop: '1%',
                width: '90%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '0px',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontSize: isSmallScreen ? '0.8em' : '1em',
            }
        },
        muiTableHeadCellProps: {
            sx: {
                fontSize: isSmallScreen ? '0.8em' : '1.2em',
            }
        },
        renderRowActions: ({ row }) => (
            <IconButton
                variant="light"
                disabled={row.original.checkedBy !== ""} // Disable the button if checkedBy is not an empty string
                sx={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                        backgroundColor: 'lightgray',
                    },
                }}
                onClick={async () => {
                    handleCheck({ id: row.original.id });
                }}
            >
                <CheckCircleOutlineIcon />
            </IconButton>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                <Button
                    variant='primary'
                    onClick={
                        async () => {
                            alert('Create checksheet...');
                        }
                    }
                >
                    Create
                </Button>

                <Button
                    variant='success'
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    onClick={
                        async () => {
                            alert('Mark lab as checked...');
                        }
                    }
                >
                    Check
                </Button>
            </Box>

        ),
    });

    return (
        <>
            <Box
                justifyContent={'center'}
                alignItems={'center'}
                marginTop={isSmallScreen ? '8vh' : '15vh'}
                marginBottom={'0px'}
                marginLeft={'auto'}
                marginRight={'auto'}
                maxWidth={'96%'}
                overflow={'auto'}
                padding={'0px'}
            >
                <MaterialReactTable table={table} />
            </Box>
        </>
    );
};

export default ChecksheetPage;
