import { useEffect, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {
    IconButton
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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

            setData(uncheckedSheets);
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
                accessorKey: 'id',
                header: 'Id',
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
        enableClickToCopy: true,
        enablePagination: false,
        initialState: {
            columnPinning: { left: ['lab'] },
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
    });

    return (
        <MaterialReactTable table={table} />
    );
};

export default ChecksheetPage;
