import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../Redux/action";
import {
  Box,
  Heading,
  Button,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
  Select,
  Grid,
  useToast,
  Text,
  Link
} from "@chakra-ui/react";
import ProductCard from "../../Components/ProductCard";
import Breadcrumbs from "../../Components/Breadcrumb";
import { FilterPriceRange } from "./FilterPrice";
import FilterCategory from "./FilterCategory";
import FilterColor from "./FilterColor";
import { FilterDiscount } from "./FilterDiscount";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState("");
  const toast = useToast();

  const data = useSelector((state) => state.productsReducer.AllProducts);
  const isLoading = useSelector((state) => state.productsReducer.isLoading);
  const dispatch = useDispatch();

  const totalPages = useSelector((store) => {
    return store.productsReducer.totalPages;
  });

  if (page > totalPages) {
    if (totalPages !== 0) {
      setPage(1);
    }
  }

  const handlePrevPage = () => {
    if (page === 1) {
      toast({ description: "You are on the First page" });
      return;
    }
    setPage((page) => page - 1);
  };
  const handleNextPage = () => {
    if (page === totalPages) {
      toast({ description: "You are on the Last page" });
      return;
    }
    setPage((page) => page + 1);
  };

  const handleSort = (e) => {
    if (e.target.value === "") {
      dispatch(getProducts(1));
      return;
    }
    setPage(1);
    setSorting(e.target.value);
  };

  let [categoryFilter, setCategoryFilter] = useState([]);
  const [priceRangeFilter, setPriceRangeFilter] = useState("");
  const [discountFilter, setDiscountFilter] = useState("");
  const [colorFilter, setColorFilter] = useState([]);

  const [checkedItems, setCheckedItems] = useState([
    false,
    false,
    false,
    false,
  ]);
  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  useEffect(() => {
    let categoryQuery = "";
    let priceQuery = "";
    let discountQuery = "";
    let colorQuery = "";

    if (categoryFilter.length > 0) {
      categoryQuery = categoryFilter
        .filter((category) => category !== "")
        .map((category) => `category=${category}`)
        .join("&");
    }

    if (priceRangeFilter !== "") {
      const [minPrice, maxPrice] = priceRangeFilter.split("-");
      priceQuery = `price_gte=${minPrice}&price_lte=${maxPrice}`;
    }

    const regex = /(\d+)%-(\d+)%/;
    const match = discountFilter.match(regex);
    if (match) {
      const firstNumber = parseInt(match[1]);
      const secondNumber = parseInt(match[2]);
      discountQuery = `id_gte=${firstNumber}&id_lte=${secondNumber}`;
    }

    colorQuery = colorFilter.map((color) => `color_like=${color}`).join("&");

    dispatch(
      getProducts(
        page,
        sorting,
        categoryQuery,
        priceQuery,
        colorQuery,
        discountQuery,
        totalPages
      )
    );
  }, [
    page,
    sorting,
    categoryFilter,
    priceRangeFilter,
    colorFilter,
    discountFilter,totalPages,dispatch
  ]);

  const isError = useSelector((store) => {
    return store.productsReducer.isError;
  });
  const handlereload = () => {
    window.location.reload();
  };

  if (data.length === 0) {
    return (
      <Box color={"black"} my={"100px"}>
        {" "}
        <Heading>NO PRODUCTS AVAILABLE</Heading>{" "}
        <Link onClick={handlereload} color={'blue'}>Show All Products</Link>
      </Box>
    );
  }
  if (isError) {
    return (
      <Box color={"white"} my={"100px"}>
        {" "}
        <Heading color={"red"}>UNEXPECTED ERROR OCCURED</Heading>{" "}
        <Text>Please Refresh the page</Text>
      </Box>
    );
  }
  return (
    <Box bg={"#F5F5F5"} padding={"50px"}>
      <Box>
        <Breadcrumbs />
        <Flex justify={"end"} mt={"10px"}>
          <Box w={{ base: "60%", md: "30%" }} color="black">
            <Select
              w="90%"
              m="auto"
              // bg={"rgb(38,38,38)"}
              _hover={{ borderColor: "rgb(38,38,38)" }}
              // _focus={{ borderColor: "rgb(38,38,38)" }}
              onChange={handleSort}
            >
              <option
                style={{
                  backgroundColor: "rgb(38,38,38)",
                  color: "white",
                }}
                value=""
              >
                SORT BY PRICE
              </option>
              <option
                style={{
                  backgroundColor: "rgb(38,38,38)",
                  color: "white",
                }}
                value="asc"
              >
                LOW TO HIGH
              </option>
              <option
                style={{
                  backgroundColor: "rgb(38,38,38)",
                  color: "white",
                }}
                value="desc"
              >
                HIGH TO LOW
              </option>
            </Select>
          </Box>
        </Flex>
        <Box display={"flex"} flexDirection={{ base: "column", lg: "row" }}>
          <Box
            w={{ base: "100%", lg: "20%" }}
            m="auto"
            color={"var(--bodyblack)"}
            fontSize={"1.5em"}
            marginTop={{ base: null, md: "1.5em" }}
            fontWeight={"200"}
          >
            <Grid
              gridTemplateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(1, 1fr)",
              }}
              gap="1em"
            >
              <Box>
                <p style={{ fontSize: "0.8em", color: "grey", fontWeight: 300 }}>
                  FILTER BY CATEGORY
                </p>

                <FilterCategory
                  checkedItems={checkedItems}
                  setCheckedItems={setCheckedItems}
                  allChecked={allChecked}
                  isIndeterminate={isIndeterminate}
                  setCategoryFilter={setCategoryFilter}
                />
              </Box>
              <Box>
                <p style={{ fontSize: "0.8em", color: "grey", fontWeight: 300 }}>
                  FILTER BY PRICE RANGE
                </p>
                <FilterPriceRange setPriceRangeFilter={setPriceRangeFilter} />
              </Box>
              <Box>
                <p style={{ fontSize: "0.8em", color: "grey", fontWeight: 300 }}>
                  FILTER BY DISCOUNT
                </p>
                <FilterDiscount setDiscountFilter={setDiscountFilter} />
              </Box>
              <Box>
              <p style={{ fontSize: "0.8em", color: "grey", fontWeight: 300 }}>
                  FILTER BY COLOR
                </p>
                <FilterColor setColorFilter={setColorFilter} />
              </Box>
            </Grid>
          </Box>

          {/* Skeleton */}
          {isLoading ? (
            <Box
              w={{ base: "80%", lg: "65%" }}
              m="auto"
              display={"grid"}
              gridTemplateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              }}
              gap={{ base: "10px", md: "1em" }}
              paddingTop={{ base: "1em", md: "2em", lg: "3em" }}
            >
              {[0, 0, 0, 0, 0, 0, 0, 0, 0].map((ele, i) => {
                return (
                  <Box
                    h="400px"
                    border={"1px solid grey"}
                    borderRadius={"20px"}
                    p="10px"
                  >
                    <Skeleton borderRadius={"20px"}>
                      <div>this</div>
                      <div>is</div>
                      <div>a</div>
                      <div>skeleton</div>
                      <div>skeleton</div>
                      <div>skeleton</div>
                      <div>skeleton</div>
                    </Skeleton>
                    <SkeletonCircle size="10" mt="4" />
                    <SkeletonText
                      mt="4"
                      noOfLines={6}
                      spacing="4"
                      skeletonHeight="2"
                    />
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box
              w={{ base: "90%", lg: "65%" }}
              m="auto"
              display={"grid"}
              gridTemplateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              }}
              gap={{ base: "10px", md: "20px" }}
              paddingTop={{ base: "1em", md: "2em", lg: "3em" }}
              // border={"1px solid red"}
            >
              {data?.map((prod) => { 
                return (
                  <ProductCard
                    productData={prod}
                    key={prod.id}
                    discount={prod.id}
                  />
                );
              })}
            </Box>
          )}
        </Box>

        {/* Pagination */}
        <Box w="200px" m="auto" my={"50px"}>
          <Flex justify={"space-between"}>
            <Button
              variant="outline"
              disabled={page <= 1 ? true : false}
              onClick={handlePrevPage}
              style={{
                backgroundColor: "var(--card--white)",
                padding: "0.5em 1em",
                border: "0.5px solid var(--orange)",
                color: "var(--orange)",
                borderRadius: "5px",
                margin: "0 1em",
                transition: "0.25s ease-in-out",
              }}
              _hover={{
                cursor: "pointer",
                backgroundColor: "var(--orange)",
                color: "white",
                boxShadow: "rgba(223, 120, 24, 0.2) 0px 2px 8px 0px",
              }}
            >
              Prev
            </Button>

            <Button
              style={{
                color: "var(--orange)",
                fontSize: "1.5em",
                backgroundColor: "transparent",
              }}
            >
              {page}
            </Button>

            <Button
              disabled={page >= totalPages ? true : false}
              onClick={handleNextPage}
              style={{
                backgroundColor: "var(--card--white)",
                padding: "0.5em 1em",
                border: "0.5px solid var(--orange)",
                color: "var(--orange)",
                borderRadius: "5px",
                margin: "0 1em",
                transition: "0.25s ease-in-out",
              }}
              _hover={{
                cursor: "pointer",
                backgroundColor: "var(--orange)",
                color: "white",
                boxShadow: "rgba(223, 120, 24, 0.2) 0px 2px 8px 0px",
              }}
            >
              Next
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
