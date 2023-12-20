import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import CheckOutModal from "../components/CheckOutModal";
import "../styles/Detail.css";

function Detail() {
  const { id } = useParams();
  const [carData, setCarData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Lấy dữ liệu của xe từ ID
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const apiUrl = `http://127.0.0.1:8000/api/car/${id}`;

        fetch(apiUrl, {
          method: "GET",
        })
          .then((res) => {
            if (!res.ok) {
              console.log("Error!");
              throw new Error(res.message);
            }
            return res.json();
          })
          .then((data) => {
            console.log(data.data);
            setCarData(data.data);
            setLoading(false);
          });
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // re-render tổng ngày thuê
  useEffect(() => {
    const calculateTotalDays = () => {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
          setError("Ngày trả phải lớn hơn ngày nhận");
          return;
        }

        const diffInMilliseconds = end - start;
        const days = diffInMilliseconds / (1000 * 60 * 60 * 24);
        setTotalDays(days);
        setError(null);
      }
    };

    calculateTotalDays();
  }, [startDate, endDate]);

  // re-render tổng tiền khi ngày tháng thay đổi
  useEffect(() => {
    const calculateTotalPrice = () => {
      if (carData) {
        const pricePerDay = carData.price;
        const calculatedTotalPrice =
          pricePerDay * totalDays * 1000 + carData.insuranceFees * totalDays;
        return calculatedTotalPrice; // Return the calculated total price
      }
      return 0; // Return 0 if carData is not available
    };

    const totalPrice = calculateTotalPrice(); // Calculate total price
    setTotalPrice(totalPrice); // Update the state once
  }, [carData, totalDays]);

  // hàm thanh toán
  const rentBtnClick = (e) => {
    e.preventDefault();

    setShowModal(true);
  };

  const addToCart = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://656d757bbcc5618d3c23335e.mockapi.io/car-rental/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fuelType: carData.fuelType,
            avatar: carData.avatar,
            price: carData.price,
            fuelConsumption: carData.fuelConsumption,
            transmission: carData.transmission,
            seats: carData.seats,
            insuranceFees: carData.insuranceFees,
            address: carData.address,
            name: carData.name,
          }),
        }
      );

      if (response.ok) {
        console.log("Added to Cart:", carData);
      } else {
        console.error("Error adding to cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <Layout>
      <div className="detail-container">
        {/* car avatar section*/}
        {loading && <p>Đợi xíu nha ^^...</p>}
        {error && <p>{error}</p>}
        {carData && (
          <div className="car-avatar">
            <div className="main-avatar-fix">
              <img
                className="main-avatar"
                src={require(`../assets/imageCars/${carData.LEFT_IMG}.jpg`)}
                alt={carData.LEFT_IMG}
              />
            </div>
            <div className="other-avatar">
              <div className="car-avatar-1-fix">
                <img
                  className="car-avatar-1"
                  src={require(`../assets/imageCars/${carData.FRONT_IMG}.jpg`)}
                  alt={carData.FRONT_IMG}
                />
              </div>
              <div className="car-avatar-2-fix">
                <img
                  className="car-avatar-2"
                  src={require(`../assets/imageCars/${carData.BACK_IMG}.jpg`)}
                  alt={carData.BACK_IMG}
                />
              </div>
              <div className="car-avatar-3-fix">
                <img
                  className="car-avatar-3"
                  src={require(`../assets/imageCars/${carData.RIGHT_IMG}.jpg`)}
                  alt={carData.RIGHT_IMG}
                />
              </div>
            </div>
          </div>
        )}

        {/*rent-box section*/}
        {carData && (
          <form className="rent-box">
            <div className="total-price-header">
              <h2>{carData.price}K/ngày</h2>
            </div>
            <div className="date-time-form">
              <div className="date-time-input">
                <p>Ngày nhận</p>
                <input
                  type="date"
                  name=""
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-time-input">
                <p>Ngày trả</p>
                <input
                  type="date"
                  name=""
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="location">
              <h3>Địa điểm giao xe</h3>
              <p>{carData.address}</p>
            </div>
            <div className="price-form-container">
              <div className="price-items">
                <p>Đơn giá thuê</p>
                <span>{carData.price}k/ngày</span>
              </div>
              <div className="price-items">
                <p>Phí bảo hiểm :</p>
                <span>{carData.insuranceFees} vnd/ngày</span>
              </div>
              <div className="price-items">
                <p>Số ngày thuê</p>
                <span>{totalDays}</span>
              </div>
              <div className="price-items">
                <p>Tổng tiền:</p>
                <span>{totalPrice} VNĐ</span>
              </div>
            </div>
            <div className="rent-actions price-items">
              <button onClick={addToCart}>Thêm vào giỏ hàng</button>
              <button onClick={rentBtnClick}>Chọn thuê</button>
            </div>
          </form>
        )}
        {showModal && (
          <CheckOutModal
            carData={carData}
            startDate={startDate}
            endDate={endDate}
            totalDays={totalDays}
            totalPrice={totalPrice}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* car description section */}
        <div className="car-description">
          <h3>Mô tả</h3>
          <p>
            {carData.DESCRIPTION}.
          </p>
        </div>

        {/* car feature section */}
        <div className="car-feature-container">
          <hr />
          <h3>Đặc điểm</h3>
          <div className="car-feature-box">
            <div className="car-feature-item">
              <div className="car-feature-icon-fix">
                <img src={require("../assets/img/seats-icon.png")} alt="" />
              </div>
              <h5>Số ghế</h5>
              <p>{carData && carData.seats ? carData.seats : "chưa rõ"}</p>
            </div>
            <div className="car-feature-item">
              <div className="car-feature-icon-fix">
                <img
                  src={require("../assets/img/transmission-icon.png")}
                  alt=""
                />
              </div>
              <h5>Truyền động</h5>
              <p>
                {carData && carData.transmission
                  ? carData.transmission
                  : "chưa rõ"}
              </p>
            </div>
            <div className="car-feature-item">
              <div className="car-feature-icon-fix">
                <img src={require("../assets/img/fuel-type-icon.png")} alt="" />
              </div>
              <h5>Nhiên liệu sử dụng</h5>
              <p>
                {carData && carData.fuelType ? carData.fuelType : "chưa rõ"}
              </p>
            </div>
            <div className="car-feature-item">
              <div className="car-feature-icon-fix">
                <img
                  src={require("../assets/img/fuel-consumption-icon.png")}
                  alt=""
                />
              </div>
              <h5>Nhiêu liệu tiêu hao</h5>
              <p>
                {carData && carData.fuelConsumption
                  ? carData.fuelConsumption
                  : "chưa rõ"}{" "}
                lít/100km
              </p>
            </div>
          </div>
          <hr />
        </div>

        <div className="car-other-amenities">
          <h2>Các tiện nghi khác</h2>
          {/* { carData.otherAmenities ? 
              <ul className="other-amenities-list">
                {
  
                }
              </ul>
              :  */}
          <h3>Chưa có thông tin</h3>
          {/* } */}
        </div>
      </div>
    </Layout>
  );
}

export default Detail;
