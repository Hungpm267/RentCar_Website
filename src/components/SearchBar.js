import React, { useState } from "react";
import CarList from "../components/CarList";
import "../styles/SearchBar.css";

export default function SearchBar() {
  const [isSelfDrivingSelected, setIsSelfDrivingSelected] = useState(true);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [selectedButton, setSelectedButton] = useState("self-driving");
  const [location, setLocation] = useState('');

  const handlePickupDateChange = (event) => {
    const newPickupDate = event.target.value;
    setPickupDate(newPickupDate);
    validateDateRange(newPickupDate, returnDate);
  };

  const handleReturnDateChange = (event) => {
    const newReturnDate = event.target.value;
    setReturnDate(newReturnDate);
    validateDateRange(pickupDate, newReturnDate);
  };

  const handleLocationChange = (event) => {
    const newLocation = event.target.value;
    setLocation(newLocation);
  };

  const validateDateRange = (start, end) => {
    return start && end && new Date(end) > new Date(start);
  };

  const handleToggle = (isSelfDriving) => {
    setIsSelfDrivingSelected(isSelfDriving);
    setSelectedButton(isSelfDriving ? "self-driving" : "with-driver");
  };

  const handleSearch = () => {
    if (hasRequiredInput()) {
      const apiUrl = "http://127.0.0.1:8000/api/cars";
       
      console.log(pickupDate, returnDate, location);
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
          setSearchResults(data.data);
        })
        .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
    } else {
      alert("Vui lòng nhập đủ thông tin và chọn ngày hợp lệ");
    }
  };

  const hasRequiredInput = () => {
    if (isSelfDrivingSelected) {
      return pickupDate && returnDate;
    } else {
      const pickupPoint = document.getElementsByName("pick-up-point")[0].value;
      const destinationPoint =
        document.getElementsByName("destination-point")[0].value;
      return pickupDate && returnDate && pickupPoint && destinationPoint;
    }
  };

  return (
    <div>
      <div className="search-options">
        <div className="search-options-toggle">
          <button
            onClick={() => handleToggle(true)}
            className={selectedButton === "self-driving" ? "selected" : ""}
          >
            Xe tự lái
          </button>
          <button
            onClick={() => handleToggle(false)}
            className={selectedButton === "with-driver" ? "selected" : ""}
          >
            Xe có tài xế
          </button>
        </div>

        {(isSelfDrivingSelected || !isSelfDrivingSelected) && (
          <div
            className={`search-input ${
              isSelfDrivingSelected ? "self-driving" : "car-with-driver"
            }`}
          >
            {isSelfDrivingSelected && (
              <div className="location-input">
                <p>Địa điểm nhận xe</p>
                <input
                  type="text"
                  name="location"
                  placeholder="Nhập địa điểm"
                  value={location}
                  onChange={handleLocationChange}
                />
              </div>
            )}

            <div className="rental-period-input-box">
              <h3>THỜI GIAN THUÊ</h3>
              <div className="rental-period-input">
                <div>
                  <p>Thời gian nhận xe</p>
                  <input
                    type="date"
                    name="pickupDate"
                    value={pickupDate}
                    onChange={handlePickupDateChange}
                  />
                </div>
                <div>
                  <p>Thời gian trả xe</p>
                  <input
                    type="date"
                    name="returnDate"
                    value={returnDate}
                    onChange={handleReturnDateChange}
                  />
                </div>
              </div>
            </div>
            {!isSelfDrivingSelected && (
              <div className="route-input">
                <div className="pick-up-box">
                  <div className="pick-up-point">
                    <p>Điểm đón</p>
                    <input
                      type="text"
                      name="pick-up-point"
                      placeholder="Nhập địa điểm cụ thể"
                    />
                  </div>
                  <div className="destination-point">
                    <p>Điểm đến</p>
                    <input
                      type="text"
                      name="destination-point"
                      placeholder="Nhập địa điểm cụ thể"
                    />
                  </div>
                </div>
                <div className="is-round-trip">
                  <p>Có khứ hồi</p>
                  <input type="checkbox" name="round-trip" />
                </div>
              </div>
            )}
            <div className="search-btn">
              <button onClick={handleSearch}>Tìm xe</button>
            </div>
          </div>
        )}
      </div>
      {searchResults && (
        <div className="result-search">
          <h3>Kết quả tìm kiếm</h3>
          <CarList cars={searchResults} />
        </div>
      )}
    </div>
  );
}
