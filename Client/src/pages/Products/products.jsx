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
// import productsForm from './productsForm';

const products = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [productsList, setproductsList] = useState([]);
  const [productsData, setproductsData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getproducts();
    return () => {
      setproductsList([]);
    };
  }, []);

  const getproducts = async () => {
    // setShowBackDrop(true);
    // dispatch(startLoader());
    // await requestsApi
    //     .getRequest("api/products")
    //     .then(function (response) {
    //         setproductsList(response.data);
    //         if(response.data.length === 0){
    //             dispatch(
    //                 showSelfCloseAlert({
    //                     type: ALERT_WARNING,
    //                     message: "products not found"
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
    if (productsData && !showModal) setproductsData(null);
  };

  const handleDelete = async (id) => {
    setShowBackDrop(true);
    await requestsApi
      .deleteRequest(`api/products/${id}`)
      .then(function (response) {
        getproducts();
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
      text: "You want to delete this products?",
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
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ value }) => formatString(value),
      },
      {
        Header: "Unit",
        accessor: "unit",
        Cell: ({ value }) => formatString(value),
      },

      {
        Header: "Minimum Quantity",
        accessor: "minimumQuantity",
        className: "cell-center",
      },
      {
        Header: "Total Quantity",
        accessor: "availableQuantity",
        className: "cell-center",
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
              {!noAccess && (
                <Tooltip title="Edit" arrow>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setItemData(original);
                      handleModal();
                    }}
                  >
                    <EditOutlined color={theme.palette.primary.main} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="View Details" arrow>
                <IconButton
                  color="primary"
                  onClick={async () => {
                    try {
                      setShowBackDrop(true);
                      const [inwardsRes, outwardsRes] = await Promise.all([
                        requestsApi.getRequest(
                          `api/inwards/item/${original.id}`
                        ),
                        requestsApi.getRequest(
                          `api/outward/item/${original.id}`
                        ),
                      ]);
                      const sortedInwards = (inwardsRes.data || [])
                        .slice()
                        .sort((a, b) => {
                          return (
                            new Date(a.inward_date) - new Date(b.inward_date)
                          );
                        });

                      // Sort outwards by 'createdAt' ascending
                      const sortedOutwards = (outwardsRes.data || [])
                        .slice()
                        .sort((a, b) => {
                          return new Date(a.createdAt) - new Date(b.createdAt);
                        });

                      setDetailsData({
                        item: original,
                        inwards: sortedInwards,
                        outwards: sortedOutwards,
                      });
                      setShowDetailsModal(true);
                    } catch (err) {
                      dispatch(
                        showAlert({
                          type: ALERT_ERROR,
                          message: "Failed to fetch item details",
                        })
                      );
                    } finally {
                      setShowBackDrop(false);
                    }
                  }}
                >
                  <EyeOutlined />
                </IconButton>
              </Tooltip>

              {original.availableQuantity === 0 ? (
                <Tooltip title="Zero Stock" arrow>
                  <FiberManualRecordIcon sx={{ color: "red", fontSize: 32 }} />
                </Tooltip>
              ) : original.availableQuantity < original.minimumQuantity ? (
                <Tooltip title="Less Than Minimum" arrow>
                  <FiberManualRecordIcon sx={{ color: "red", fontSize: 32 }} />
                </Tooltip>
              ) : original.availableQuantity > original.minimumQuantity ? (
                <Tooltip title="Greater Than Minimum" arrow>
                  <FiberManualRecordIcon
                    sx={{ color: "green", fontSize: 32 }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Equal to Minimum" arrow>
                  <FiberManualRecordIcon
                    sx={{ color: "orange", fontSize: 32 }}
                  />
                </Tooltip>
              )}
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
        data={productsList}
        handleAddModal={handleModal}
        getHeaderProps={(column) => column.getSortByToggleProps()}
        buttonName="Add Products"
        getList={getproducts}
        showButtonIcon={true}
        title="Products"
      />
      {/* {showModal && (
                <productsForm
                    size="sm"
                    isPopUpShow={showModal}
                    productsData={productsData}
                    toggleModal={handleModal}
                    updateList={getproducts}
                />
            )} */}
    </MainCard>
  );
};

export default products;
