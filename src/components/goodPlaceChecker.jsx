"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

const LifestyleCheck = () => {
  const [address, setAddress] = useState("");
  const [map, setMap] = useState(null);
  const [results, setResults] = useState({
    convenience: null,
    subway: null,
    movie: null,
  });
  const [distances, setDistances] = useState({
    convenience: null,
    subway: null,
    movie: null,
  });
  const [nearestPlaces, setNearestPlaces] = useState({
    convenience: null,
    subway: null,
    movie: null,
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=you_apikey&libraries=services&autoload=false`;
    script.defer = true;
    script.async = true;
    script.onload = () => {
      kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(37.566826, 126.978656),
          level: 3,
        };
        const kakaoMap = new kakao.maps.Map(container, options);
        setMap(kakaoMap);
      });
    };
    document.head.appendChild(script);

    const daumScript = document.createElement("script");
    daumScript.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    daumScript.defer = true;
    daumScript.async = true;
    document.head.appendChild(daumScript);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(daumScript);
    };
  }, []);

  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setAddress(data.address);
        searchLocation(data.address);
      },
    }).open();
  };

  const searchLocation = (searchAddress) => {
    if (!map) return;

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(searchAddress, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 기존 마커 제거
        if (window.currentMarker) {
          window.currentMarker.setMap(null);
        }

        // 새 마커 생성
        const marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        window.currentMarker = marker;
        map.setCenter(coords);
        checkLifestyleZones(coords);
      }
    });
  };

  const checkLifestyleZones = (coords) => {
    const places = new kakao.maps.services.Places();

    // 편의점 검색
    places.keywordSearch(
      "편의점",
      (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const distancesWithNames = result.map((place) => ({
            distance: calcDistance(
              coords.getLat(),
              coords.getLng(),
              parseFloat(place.y),
              parseFloat(place.x)
            ),
            name: place.place_name,
          }));

          const nearest = distancesWithNames.reduce(
            (min, curr) => (curr.distance < min.distance ? curr : min),
            distancesWithNames[0]
          );

          const hasNearby = nearest.distance <= 0.5; // 500m 이내
          setResults((prev) => ({ ...prev, convenience: hasNearby }));
          setDistances((prev) => ({
            ...prev,
            convenience: nearest.distance * 1000,
          }));
          setNearestPlaces((prev) => ({ ...prev, convenience: nearest.name }));
        }
      },
      { location: coords }
    );

    // 지하철역 검색
    places.keywordSearch(
      "지하철역",
      (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const distancesWithNames = result.map((place) => ({
            distance: calcDistance(
              coords.getLat(),
              coords.getLng(),
              parseFloat(place.y),
              parseFloat(place.x)
            ),
            name: place.place_name,
          }));

          const nearest = distancesWithNames.reduce(
            (min, curr) => (curr.distance < min.distance ? curr : min),
            distancesWithNames[0]
          );

          const hasNearby = nearest.distance <= 0.5; // 500m 이내
          setResults((prev) => ({ ...prev, subway: hasNearby }));
          setDistances((prev) => ({
            ...prev,
            subway: nearest.distance * 1000,
          }));
          setNearestPlaces((prev) => ({ ...prev, subway: nearest.name }));
        }
      },
      { location: coords }
    );

    // 영화관 검색
    places.keywordSearch(
      "영화관",
      (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const distancesWithNames = result.map((place) => ({
            distance: calcDistance(
              coords.getLat(),
              coords.getLng(),
              parseFloat(place.y),
              parseFloat(place.x)
            ),
            name: place.place_name,
          }));

          const nearest = distancesWithNames.reduce(
            (min, curr) => (curr.distance < min.distance ? curr : min),
            distancesWithNames[0]
          );

          const hasNearby = nearest.distance <= 0.5; // 500m 이내
          setResults((prev) => ({ ...prev, movie: hasNearby }));
          setDistances((prev) => ({ ...prev, movie: nearest.distance * 1000 }));
          setNearestPlaces((prev) => ({ ...prev, movie: nearest.name }));
        }
      },
      { location: coords }
    );
  };

  const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">생활권 체크</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4 items-center justify-center">
              <div className="flex-1 text-gray-500">
                {address || "주소를 검색해주세요"}
              </div>
              <Button onClick={openAddressSearch}>주소 검색</Button>
            </div>

            <div id="map" className="w-full h-64 rounded-lg overflow-hidden" />

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="font-medium mb-2">편세권</div>
                  {results.convenience !== null && (
                    <>
                      {results.convenience ? (
                        <Check className="mx-auto text-green-500" />
                      ) : (
                        <X className="mx-auto text-red-500" />
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        {distances.convenience && (
                          <>
                            {Math.round(distances.convenience)}m
                            {nearestPlaces.convenience && (
                              <div className="text-xs mt-1 text-gray-600">
                                ({nearestPlaces.convenience})
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="font-medium mb-2">역세권</div>
                  {results.subway !== null && (
                    <>
                      {results.subway ? (
                        <Check className="mx-auto text-green-500" />
                      ) : (
                        <X className="mx-auto text-red-500" />
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        {distances.subway && (
                          <>
                            {Math.round(distances.subway)}m
                            {nearestPlaces.subway && (
                              <div className="text-xs mt-1 text-gray-600">
                                ({nearestPlaces.subway})
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="font-medium mb-2">영세권</div>
                  {results.movie !== null && (
                    <>
                      {results.movie ? (
                        <Check className="mx-auto text-green-500" />
                      ) : (
                        <X className="mx-auto text-red-500" />
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        {distances.movie && (
                          <>
                            {Math.round(distances.movie)}m
                            {nearestPlaces.movie && (
                              <div className="text-xs mt-1 text-gray-600">
                                ({nearestPlaces.movie})
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifestyleCheck;
