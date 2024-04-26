import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardFooter,
  Image,
  Button,
  Pagination,
  Progress,
} from "@nextui-org/react";

import ubc_img from "../assets/ubc_aerial.jpeg";
import axios from "axios";
import JSZip from "jszip";

const HOST_URL = import.meta.env.VITE_HOST_DNS

export const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [value, setValue] = React.useState(0);
  const [images, setImages] = useState([]);
  const scrollContainer = useRef(null);
  const imgContainer = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [page, setPage] = React.useState(1);
  const handleChange = (value) => {
    goToImage(value - 1);
    setPage(value);
  };
  const [progress_val, setProgress] = useState(0)
  const [is_uploaded, setIsUpload] = useState(false)
  const zip = new JSZip();

  const [downloadUrl, setDownloadUrl] = useState('');
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  // Function to navigate to a specific image
  const goToImage = (index) => {
    if (scrollContainer.current) {
      const { current: container } = scrollContainer;
      const scrollTo = imgContainer.current.offsetWidth * index;
      container.scrollLeft = scrollTo;
    }
  };

  // Function to auto scroll preview images
  const scroll = (direction) => {
    if (scrollContainer.current) {
      const { current: container } = scrollContainer;
      const scrollAmount =
        direction === "left"
          ? -imgContainer.current.offsetWidth
          : imgContainer.current.offsetWidth;
      container.scrollLeft += scrollAmount;
    }
  };

  // Function to handle the upload of the video file
  const handleUpload = async () => {

    // Set the upload state to true
    setIsUpload(true);
    let formData = new FormData();
    if (selectedFile == null) {
      return;
    }

    formData.append("video-file", selectedFile);
    try {
      const response = await axios.post(HOST_URL + ':81/upload_video', formData, {
        responseType: 'blob', // Important to handle the zip file correctly
      });
      const blobUrl = URL.createObjectURL(response.data);
      setIsUpload(false);
      setProgress(100);
      setDownloadUrl(blobUrl); // Update the state with the URL
      setIsButtonVisible(true); // Make the download button visible
    } catch (error) {
      setIsUpload(false);
      alert("Failed to upload video", error);
      return;
    }
  };


  useEffect(() => {
    // Function to fetch value and set progress
    const fetchValue = () => {
        axios.get(HOST_URL + ':81/value')
            .then((response) => {
                setProgress(response.data.value);
            })
            .catch((error) => console.error('Error fetching value:', error));
    };

    // Function to get and fetch preview images
    const fetchPreview = async () => {
      const response = await fetch(HOST_URL + ':81/preview');
      const contentType = response.headers.get("Content-Type");
      if (contentType.includes("application/json")) {
          // If the response is JSON, it must be an error message
          response.json().then(data => {
          if (data.error) {
            // fail to get preview images, as the video is not uploaded/ processed/ same image as before
          }
          });
      } else if (contentType.includes("image/png")) {
          // If the response is an image, proceed as before
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setImages(images => [...images, url]);
      }
      return;
    };

    // Check immediately if already uploaded
    if (is_uploaded) {
        fetchValue();
    }

    let i = 0;

    // Set up interval to check regularly
    const interval = setInterval(() => {
        if (is_uploaded) {
            fetchValue();
            if(i == 4){
              fetchPreview();
              i=0;
            }
            i++;
        }
    }, 500);

    // Clean up interval on component unmount or is_uploaded change
    return () => clearInterval(interval);
}, [is_uploaded]);

  useEffect(() => {
    let interval;

    // Auto scroll preview images
    if (isAutoScrolling) {
      interval = setInterval(() => {

        // Calculate the maximum scroll left value
        const maxScrollLeft =
          scrollContainer.current.scrollWidth -
          scrollContainer.current.clientWidth;

        // If the scroll is not at the end, scroll right
        if (scrollContainer.current.scrollLeft+imgContainer.current.offsetWidth/2 < maxScrollLeft) {
          scroll("right");
        } else {
          scrollContainer.current.scrollLeft = 0;
        }

        // Calculate the current page index
        let page_index =
          Math.round(
            scrollContainer.current.scrollLeft /
              imgContainer.current.offsetWidth
          ) + 2;

        // If the page index is greater than the number of images, reset it
        if (page_index > images.length) {
          page_index = 1;
        }

        // Update the page state
        setPage(page_index);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  // Function to handle the file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProgress(0);
    setImages([]);
    setIsButtonVisible(false);
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setSelectedFile(null);
      setPreviewUrl("");
    }
  };

  //HTML of the Home page
  return (
    <div className="flex-box">
      <div className="flex justify-center">
        <div className="w-[70%] flex-box justify-center mt-5">
          <div className="text-center font-semibold text-6xl m-5">
            Drone Footage
          </div>
          <Card isFooterBlurred={true} radius="lg" className="border-none m-5">
            <div className=" w-full pb-[50px]">
              {previewUrl ? (
                <div className="mt-4">
                  <video
                    src={previewUrl}
                    controls
                    className="max-w-full h-auto"
                  ></video>
                </div>
              ) : (
                <Image
                  alt="Woman listing to music"
                  className="object-cover"
                  src={ubc_img}
                />
              )}
            </div>
            <CardFooter
              isFooterBlurred
              className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10"
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="flex w-full text-sm text-white
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100 justify-items-end
          "
              />
              <Button
                className="text-sm rounded-full text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 justify-items-end"
                variant="flat"
                color="default"
                radius="lg"
                size="sm"
                onClick={handleUpload}
              >
                Upload
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="flex justify-center ">
        <Progress
        aria-label="progressing..."
        size="md"
        value={progress_val}
        color="success"
        showValueLabel={true}
        className="max-w-5xl px-10 mb-10"
        />
      </div>
      <div>
      {images.length != 0 && isButtonVisible && (
        <a href={downloadUrl} download="downloaded_imgs.zip" >
          <div className="flex justify-center mb-10">
          <Button
                className="text-lg rounded-full text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 justify-items-end"
                variant="flat"
                color="default"
                radius="lg"
                size="lg"
              >Download Zip File</Button>
          </div>
        </a>
      )}
      </div>
      <div className="flex bg-gray-100 justify-center">
        <div className=" w-[90%] h-auto justify-center">
          <div className="text-start font-semibold text-6xl mt-5 mt-8 ml-20">
            Image Preview
          </div>
          <div className="flex items-center justify-center space-x-4 my-5">
            <div
              ref={scrollContainer}
              className="flex overflow-x-auto scroll-smooth scrollbar-hide w-full"
            >
              {images.map((image, index) => (
                <img
                  ref={imgContainer}
                  key={index}
                  src={image}
                  alt={`Scroll item ${index}`}
                  className="inline-block p-2 rounded-lg shadow-lg"
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Pagination
              loop
              showControls
              color="success"
              total={images.length}
              initialPage={1}
              page={page}
              onChange={handleChange}
              className="my-5 mx-2"
            />
            <Button onClick={toggleAutoScroll} className="my-5 mx-2">
              {isAutoScrolling ? "⏹️" : "▶️"}
            </Button>
          </div>
        </div>
      </div>
      
    </div>
    
  );
};
