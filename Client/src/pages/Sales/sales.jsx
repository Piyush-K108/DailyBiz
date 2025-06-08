import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MainCard from "../../components/MainCard";
import IconButton from "../../components/@extended/MuiIconButton";
import MuiBackdrop from "../../components/Loader/MuiBackdrop";
import Table from "../../common/table.jsx";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  startLoader,
  stopLoader,
  showAlert,
  showSelfCloseAlert,
  hideSelfCloseAlert,
} from "../../Redux/Counter/commonSlice";
import {
  ALERT_ERROR,
  ALERT_SUCCESS,
  ALERT_WARNING,
} from "../../common/constants";
import { getErrorDetails } from "../../common/utility";
import { Stack, Tooltip } from "@mui/material";
// import salesForm from './salesForm';

const sales = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [salesList, setsalesList] = useState([]);
  const [salesData, setsalesData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getsales();
    return () => {
      setsalesList([]);
    };
  }, []);

  const getsales = async () => {
    // setShowBackDrop(true);
    // dispatch(startLoader());
    // await requestsApi
    //     .getRequest("api/sales")
    //     .then(function (response) {
    //         setsalesList(response.data);
    //         if(response.data.length === 0){
    //             dispatch(
    //                 showSelfCloseAlert({
    //                     type: ALERT_WARNING,
    //                     message: "sales not found"
    //                 })
    //             );
    //         }else{
    //             dispatch(hideSelfCloseAlert());
    //         }
    //     })
    //     .catch(function (error) {
    //         let { msg } = getErrorDetails(error);
    //         dispatch(
    //             showAlert({
    //                 type: ALERT_ERROR,
    //                 message: msg
    //             })
    //         );
    //     })
    //     .then(function () {
    //         setShowBackDrop(false);
    //         dispatch(stopLoader());
    //     });
  };

  const handleModal = () => {
    setShowModal(!showModal);
    if (salesData && !showModal) setsalesData(null);
  };

  const handleDelete = async (id) => {
    setShowBackDrop(true);
    await requestsApi
      .deleteRequest(`api/sales/${id}`)
      .then(function (response) {
        getsales();
        dispatch(
          showAlert({
            type: ALERT_SUCCESS,
            message: response.message,
          })
        );
      })
      .catch(function (error) {
        let { msg } = getErrorDetails(error);
        dispatch(
          showAlert({
            type: ALERT_ERROR,
            message: msg,
          })
        );
      })
      .then(function () {
        setShowBackDrop(false);
      });
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this sales?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const columns = useMemo(
    () => [
      // {
      //   Header: "Barcode",
      //   accessor: "barcode",
      // },
      {
        Header: "Product",
        accessor: "item.name",
      },
      {
        Header: "Customer",
        accessor: "customer.name",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Date",
        accessor: "inward_date",
        Cell: ({ value }) => utcToIST_ddmmyyyy(value),
      },

      {
        Header: "Actions",
        className: "cell-center",
        disableSortBy: true,
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={0}
            >
              <Tooltip title="Edit" arrow>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setInwardData(original);
                    handleModal();
                  }}
                >
                  <EditOutlined color={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <IconButton
                  color="error"
                  onClick={() => confirmDelete(original.id)}
                >
                  <DeleteOutlined color={theme.palette.error.main} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ],
    [theme]
  );

  return (
    <MainCard sx={{ height: "100%", px: 2 }} content={false}>
      {showBackDrop && <MuiBackdrop isLoading={showBackDrop} />}
      <Table
        columns={columns}
        data={salesList}
        handleAddModal={handleModal}
        getHeaderProps={(column) => column.getSortByToggleProps()}
        buttonName="Add Sales"
        getList={getsales}
        showButtonIcon={true}
        title="Sales"
      />
      {/* {showModal && (
                <salesForm
                    size="sm"
                    isPopUpShow={showModal}
                    salesData={salesData}
                    toggleModal={handleModal}
                    updateList={getsales}
                />
            )} */}
    </MainCard>
  );
};

export default sales;
