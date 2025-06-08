import React, { useEffect, useState, useMemo, Fragment } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";

// material-ui
import { alpha, useTheme } from "@mui/material/styles";
import {
  useMediaQuery,
  Button,
  Stack,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TableRow,
  Typography,
  Alert,
  Collapse,
  Grid,
} from "@mui/material";

import {
  useFilters,
  useExpanded,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
  usePagination,
} from "react-table";

import {
  HeaderSort,
  // SortingSelect,
  TablePagination,
  // TableRowSelection,
} from "../components/third-party/ReactTable";

// project import
import { renderFilterTypes, GlobalFilter } from "./react-table-filter";
// import { isAdminUser } from "./utility";

// assets
import { PlusOutlined } from "@ant-design/icons";
import SelfCloseAlert from "../components/Alert/SelfCloseAlert";
// import { ALERT_WARNING } from "./constants";
import ScrollX from "../components/ScrollX";
// ==============================|| REACT TABLE ||============================== //

function CreateTable(props) {
  const {
    columns,
    data,
    showTotal,
    getHeaderProps,
    renderRowSubComponent,
    handleAddModal,
    isStoreButton = false,
    // getList,
    buttonName,
    isoutwardSlips,
    title,
    showButtonIcon,
    showStatusFilter,
    filterHandler,
    filterList,
    showButton,
  } = props;
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const filterTypes = useMemo(() => renderFilterTypes, []);
  // const sortBy = { id: "id", desc: true };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // setHiddenColumns,
    // allColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter,
    // setSortBy,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        hiddenColumns: ["avatar", "email"],
        // sortBy: [sortBy],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );
  const StatusDropdown = ({ isoutwardSlips }) => {
    const outwardOptions = [
      { label: "ALL", value: "ALL" },
      { label: "NEW", value: "NEW" },
      { label: "COMPLETE", value: "COMPLETE" },
    ];

    const inwardOptions = [
      { label: "All", value: "All" },
      { label: "Active", value: "ACTIVE" },
      { label: "Deactive", value: "DEACTIVE" },
      { label: "Delete", value: "DELETE" },
    ];

    const options = isoutwardSlips ? outwardOptions : inwardOptions;

    return (
      <FormControl sx={{ width: 200 }}>
        <Select
          id="column-hiding"
          displayEmpty
          value={filterList?.status}
          onChange={(e) => {
            filterHandler(e.target.value, "status");
          }}
          size="small"
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };


  return (
    <>
      <Stack spacing={2}>
        <Stack direction={"column"} spacing={1} sx={{ p: 3, pb: 0 }}>
          {showTotal ? (
            <Typography variant="h2">{`${title} (${props.rows})`}</Typography>
          ) : (
            <Typography variant="h2">{`${title} (${data.length})`}</Typography>
          )}

          <hr />
        </Stack>
        <Stack direction={"column"} sx={{ px: 3 }}>
          <SelfCloseAlert />
        </Stack>
        <Stack
          direction={matchDownSM ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ px: 3, pb: 0 }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          />

          <Stack
            direction={matchDownSM ? "column" : "row"}
            alignItems="center"
            spacing={1}
          >
    
            {showStatusFilter && (
              <StatusDropdown isoutwardSlips={isoutwardSlips || false} />
            )}
            {!showButton && (
              <Button
              className="bg-blue-600 "
                disabled={isStoreButton ? true : false}
                variant="contained"
                startIcon={showButtonIcon ? <PlusOutlined /> : ""}
                onClick={handleAddModal}
              >
                {buttonName}
              </Button>
            )}
          </Stack>
        </Stack>
        <ScrollX>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup, i) => (
                <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => (
                    <TableCell
                      key={index}
                      {...column.getHeaderProps([
                        { className: column.className },
                        getHeaderProps(column),
                      ])}
                    >
                      <HeaderSort column={column} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                const rowProps = row.getRowProps();
                return (
                  <Fragment key={i}>
                    <TableRow
                      {...row.getRowProps()}
                      sx={{
                        cursor: "pointer",
                        bgcolor: row.isSelected
                          ? alpha(theme.palette.primary.lighter, 0.35)
                          : "inherit",
                      }}
                    >
                      {row.cells.map((cell, index) => (
                        <TableCell
                          key={index}
                          {...cell.getCellProps([
                            {
                              className: cell.column.className,
                            },
                          ])}
                        >
                          {cell.render("Cell")}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.isExpanded &&
                      renderRowSubComponent({
                        row,
                        rowProps,
                        visibleColumns,
                      })}
                  </Fragment>
                );
              })}
              {/* <TableRow
                                sx={{
                                    "&:hover": {
                                        bgcolor: "transparent !important",
                                    },
                                }}
                            >
                                <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                                    <TablePagination
                                        gotoPage={gotoPage}
                                        rows={rows}
                                        setPageSize={setPageSize}
                                        pageSize={pageSize}
                                        pageIndex={pageIndex}
                                    />
                                </TableCell>
                            </TableRow> */}
            </TableBody>
          </Table>
        </ScrollX>
        <Stack sx={{ px: 3, pb: 2 }}>
          <TablePagination
            gotoPage={props.rows ? props.gotoPage : gotoPage}
            rows={props.rows ? props.rows : rows}
            setPageSize={props.rows ? props.setPageSize : setPageSize}
            pageSize={props.rows ? props.pageSize : pageSize}
            pageIndex={props.rows ? props.pageIndex : pageIndex}
          />
        </Stack>
      </Stack>
    </>
  );
}

CreateTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  handleAdd: PropTypes.func,
  renderRowSubComponent: PropTypes.any,
  isoutwardSlips: PropTypes.bool,
  isStoreButton: PropTypes.bool,
  
};

export default CreateTable;
