"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOUNDS, BUSINESSES, darkMapStyles, type Business } from "./constants";

type Screen = "menu" | "timer" | "game1" | "game2";

const MAPS_CALLBACK = "initRvaMaps";

function formatTimer(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RvaStreetGames() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [screen, setScreen] = useState<Screen>("menu");
  const [mapsReady, setMapsReady] = useState(false);
  const [currentGame, setCurrentGame] = useState<1 | 2 | null>(null);
  const [timerGameLabel, setTimerGameLabel] = useState("Game");
  const [timerDisplay1, setTimerDisplay1] = useState("—");
  const [timerDisplay2, setTimerDisplay2] = useState("—");
  const [timerWarning1, setTimerWarning1] = useState(false);
  const [timerWarning2, setTimerWarning2] = useState(false);
  const [scoreDisplay, setScoreDisplay] = useState("—");
  const [showGuessBtn, setShowGuessBtn] = useState(false);
  const [minimapExpanded, setMinimapExpanded] = useState(false);
  const [resultActive, setResultActive] = useState(false);
  const [resultTitle, setResultTitle] = useState("—");
  const [resultScore, setResultScore] = useState("—");
  const [resultDetail, setResultDetail] = useState("—");
  const [winActive, setWinActive] = useState(false);
  const [winTitle, setWinTitle] = useState("Found it.");
  const [winTime, setWinTime] = useState("");
  const [targetName, setTargetName] = useState("Loading...");
  const [targetAddress, setTargetAddress] = useState("");
  const [proximityPct, setProximityPct] = useState(0);
  const [proximityColor, setProximityColor] = useState("#c84b4b");
  const [proximityText, setProximityText] = useState("Move closer to find it");

  const svContainer1Ref = useRef<HTMLDivElement>(null);
  const svContainer2Ref = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);
  const map2Ref = useRef<HTMLDivElement>(null);

  const timerSecondsRef = useRef(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sv1Ref = useRef<google.maps.StreetViewPanorama | null>(null);
  const map1Ref = useRef<google.maps.Map | null>(null);
  const guessMarkerRef = useRef<google.maps.Marker | null>(null);
  const actualLatLngRef = useRef<google.maps.LatLng | null>(null);
  const guessLatLngRef = useRef<google.maps.LatLng | null>(null);

  const sv2Ref = useRef<google.maps.StreetViewPanorama | null>(null);
  const map2gRef = useRef<google.maps.Map | null>(null);
  const playerMarker2Ref = useRef<google.maps.Marker | null>(null);
  const targetBusinessRef = useRef<Business | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const submitGuessRef = useRef<() => void>(() => {});

  const clearTimers = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (!apiKey) return;

    if (window.google?.maps) {
      setMapsReady(true);
      return;
    }

    window[MAPS_CALLBACK] = () => setMapsReady(true);

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=${MAPS_CALLBACK}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      delete window[MAPS_CALLBACK];
    };
  }, [apiKey]);

  const updateTimerDisplay = useCallback(
    (displayId: "1" | "2", secs: number) => {
      const text = formatTimer(secs);
      const warning = secs <= 30 && secs > 0;
      if (displayId === "1") {
        setTimerDisplay1(text);
        setTimerWarning1(warning);
      } else {
        setTimerDisplay2(text);
        setTimerWarning2(warning);
      }
    },
    [],
  );

  const startTimer = useCallback(
    (displayId: "1" | "2", onExpire: () => void) => {
      if (timerSecondsRef.current === 0) {
        if (displayId === "1") setTimerDisplay1("∞");
        else setTimerDisplay2("∞");
        return;
      }

      let remaining = timerSecondsRef.current;
      updateTimerDisplay(displayId, remaining);

      timerIntervalRef.current = setInterval(() => {
        remaining--;
        updateTimerDisplay(displayId, remaining);
        if (remaining <= 0) {
          clearTimers();
          onExpire();
        }
      }, 1000);
    },
    [clearTimers, updateTimerDisplay],
  );

  const showMenu = useCallback(() => {
    clearTimers();
    setResultActive(false);
    setWinActive(false);
    setScreen("menu");
  }, [clearTimers]);

  const selectGame = useCallback((n: 1 | 2) => {
    setCurrentGame(n);
    setTimerGameLabel(n === 1 ? "GeoGuesser" : "Navigator");
    setScreen("timer");
  }, []);

  const placeGuessPin = useCallback((latLng: google.maps.LatLng) => {
    if (guessMarkerRef.current) {
      guessMarkerRef.current.setMap(null);
    }

    guessMarkerRef.current = new google.maps.Marker({
      position: latLng,
      map: map1Ref.current,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: "#c8a84b",
        fillOpacity: 1,
        strokeColor: "#0e0e0f",
        strokeWeight: 2,
      },
    });

    guessLatLngRef.current = latLng;
    setShowGuessBtn(true);
  }, []);

  const submitGuess = useCallback(() => {
    const guessLatLng = guessLatLngRef.current;
    const actualLatLng = actualLatLngRef.current;
    if (!guessLatLng || !actualLatLng) return;

    clearTimers();

    const distMeters = google.maps.geometry.spherical.computeDistanceBetween(
      guessLatLng,
      actualLatLng,
    );
    const distFeet = distMeters * 3.28084;

    let score: number;
    let label: string;

    if (distFeet <= 50) {
      score = 5000;
      label = "Perfect.";
    } else if (distFeet <= 500) {
      score = Math.round(5000 * (1 - (distFeet - 50) / 450));
      label = "Nice.";
    } else if (distFeet <= 2640) {
      score = Math.round(2000 * (1 - (distFeet - 500) / 2140));
      label = "Close enough.";
    } else if (distFeet <= 10560) {
      score = Math.round(500 * (1 - (distFeet - 2640) / 7920));
      label = "Off.";
    } else {
      score = 0;
      label = "Way off.";
    }

    score = Math.max(0, score);

    const distDisplay =
      distFeet < 5280
        ? `${Math.round(distFeet)} ft`
        : `${(distFeet / 5280).toFixed(2)} mi`;

    setResultTitle(label);
    setResultScore(score.toLocaleString());
    setResultDetail(`You were ${distDisplay} away.`);
    setResultActive(true);

    new google.maps.Marker({
      position: actualLatLng,
      map: map1Ref.current,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: "#4bc87a",
        fillOpacity: 1,
        strokeColor: "#0e0e0f",
        strokeWeight: 2,
      },
    });

    new google.maps.Polyline({
      path: [guessLatLng, actualLatLng],
      map: map1Ref.current,
      strokeColor: "#c8a84b",
      strokeOpacity: 0.6,
      strokeWeight: 2,
    });

    map1Ref.current?.panTo(actualLatLng);
  }, [clearTimers]);

  submitGuessRef.current = submitGuess;

  const loadRandomStreetView = useCallback(async () => {
    if (!mapsReady || !svContainer1Ref.current || !minimapRef.current) return;

    const svService = new google.maps.StreetViewService();
    let found = false;
    let attempts = 0;

    while (!found && attempts < 30) {
      attempts++;
      const lat = BOUNDS.south + Math.random() * (BOUNDS.north - BOUNDS.south);
      const lng = BOUNDS.west + Math.random() * (BOUNDS.east - BOUNDS.west);
      const loc = new google.maps.LatLng(lat, lng);

      try {
        const result = await new Promise<google.maps.StreetViewPanoramaData>(
          (res, rej) => {
            svService.getPanorama(
              {
                location: loc,
                radius: 80,
                source: google.maps.StreetViewSource.OUTDOOR,
              },
              (data, status) => {
                if (status === google.maps.StreetViewStatus.OK && data) {
                  res(data);
                } else {
                  rej(status);
                }
              },
            );
          },
        );

        actualLatLngRef.current = result.location.latLng;
        found = true;

        if (!sv1Ref.current) {
          sv1Ref.current = new google.maps.StreetViewPanorama(
            svContainer1Ref.current,
            {
              pano: result.location.pano,
              addressControl: false,
              linksControl: false,
              panControl: true,
              zoomControl: false,
              fullscreenControl: false,
              showRoadLabels: false,
              motionTracking: false,
            },
          );
        } else {
          sv1Ref.current.setPano(result.location.pano);
        }

        if (!map1Ref.current) {
          map1Ref.current = new google.maps.Map(minimapRef.current, {
            center: { lat: 37.5407, lng: -77.436 },
            zoom: 11,
            disableDefaultUI: true,
            styles: darkMapStyles(),
            clickableIcons: false,
          });

          map1Ref.current.addListener("click", (e) => {
            if (e.latLng) placeGuessPin(e.latLng);
          });
        }

        if (guessMarkerRef.current) {
          guessMarkerRef.current.setMap(null);
          guessMarkerRef.current = null;
        }
        guessLatLngRef.current = null;
        setShowGuessBtn(false);
      } catch {
        // no coverage, try again
      }
    }

    if (!found) {
      window.alert("Could not find Street View coverage. Trying again...");
      loadRandomStreetView();
    }
  }, [mapsReady, placeGuessPin]);

  const initGame1 = useCallback(() => {
    setScreen("game1");
    setScoreDisplay("—");
    setResultActive(false);
    guessMarkerRef.current = null;
    guessLatLngRef.current = null;

    startTimer("1", () => {
      if (!guessLatLngRef.current && map1Ref.current) {
        guessLatLngRef.current = map1Ref.current.getCenter();
      }
      submitGuessRef.current();
    });

    loadRandomStreetView();
  }, [loadRandomStreetView, startTimer]);

  const updatePlayerPosition = useCallback(
    (pos: google.maps.LatLng) => {
      const target = targetBusinessRef.current;
      if (!target || !playerMarker2Ref.current || !map2gRef.current) return;

      playerMarker2Ref.current.setPosition(pos);
      map2gRef.current.panTo(pos);

      const targetLatLng = new google.maps.LatLng(target.lat, target.lng);
      const distMeters = google.maps.geometry.spherical.computeDistanceBetween(
        pos,
        targetLatLng,
      );
      const distFeet = distMeters * 3.28084;

      const pct = Math.max(0, Math.min(100, 100 - (distFeet / 5280) * 100));
      setProximityPct(pct);

      if (pct < 40) setProximityColor("#c84b4b");
      else if (pct < 75) setProximityColor("#c8a84b");
      else setProximityColor("#4bc87a");

      const distDisplay =
        distFeet < 5280
          ? `${Math.round(distFeet)} ft away`
          : `${(distFeet / 5280).toFixed(1)} mi away`;
      setProximityText(distDisplay);

      if (distFeet <= 100) {
        clearTimers();
        const elapsed = Math.round(
          (Date.now() - (startTimeRef.current ?? Date.now())) / 1000,
        );
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        setWinTitle("Found it.");
        setWinTime(`${target.name} · ${m}m ${s}s`);
        setWinActive(true);
      }
    },
    [clearTimers],
  );

  const onPlayerMoved = useCallback(() => {
    const pos = sv2Ref.current?.getPosition();
    if (pos) updatePlayerPosition(pos);
  }, [updatePlayerPosition]);

  const pickTarget = useCallback(() => {
    if (!mapsReady || !svContainer2Ref.current || !map2Ref.current) return;

    const target = BUSINESSES[Math.floor(Math.random() * BUSINESSES.length)];
    targetBusinessRef.current = target;
    startTimeRef.current = Date.now();

    setTargetName(target.name);
    setTargetAddress(target.address);
    setProximityPct(0);
    setProximityText("Move closer to find it");

    const startLat = BOUNDS.south + Math.random() * (BOUNDS.north - BOUNDS.south);
    const startLng = BOUNDS.west + Math.random() * (BOUNDS.east - BOUNDS.west);
    const svService = new google.maps.StreetViewService();

    const tryStart = (lat: number, lng: number) => {
      svService.getPanorama(
        {
          location: { lat, lng },
          radius: 100,
          source: google.maps.StreetViewSource.OUTDOOR,
        },
        (data, status) => {
          if (
            status === google.maps.StreetViewStatus.OK &&
            data &&
            svContainer2Ref.current &&
            map2Ref.current
          ) {
            if (!sv2Ref.current) {
              sv2Ref.current = new google.maps.StreetViewPanorama(
                svContainer2Ref.current,
                {
                  pano: data.location.pano,
                  addressControl: false,
                  linksControl: true,
                  panControl: true,
                  zoomControl: false,
                  fullscreenControl: false,
                  showRoadLabels: false,
                  motionTracking: false,
                },
              );
              sv2Ref.current.addListener("position_changed", onPlayerMoved);
            } else {
              sv2Ref.current.setPano(data.location.pano);
            }

            if (!map2gRef.current) {
              map2gRef.current = new google.maps.Map(map2Ref.current, {
                center: { lat: 37.5407, lng: -77.436 },
                zoom: 12,
                disableDefaultUI: true,
                styles: darkMapStyles(),
                clickableIcons: false,
                gestureHandling: "greedy",
              });

              playerMarker2Ref.current = new google.maps.Marker({
                map: map2gRef.current,
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 5,
                  fillColor: "#4b8ec8",
                  fillOpacity: 1,
                  strokeColor: "#0e0e0f",
                  strokeWeight: 2,
                },
              });
            }

            updatePlayerPosition(data.location.latLng);
          } else {
            const rLat =
              BOUNDS.south + Math.random() * (BOUNDS.north - BOUNDS.south);
            const rLng =
              BOUNDS.west + Math.random() * (BOUNDS.east - BOUNDS.west);
            tryStart(rLat, rLng);
          }
        },
      );
    };

    tryStart(startLat, startLng);
  }, [mapsReady, onPlayerMoved, updatePlayerPosition]);

  const initGame2 = useCallback(() => {
    setScreen("game2");
    setWinActive(false);

    startTimer("2", () => {
      setWinTitle("Time's up.");
      setWinTime(
        `Didn't make it to ${targetBusinessRef.current?.name ?? "the target"}.`,
      );
      setWinActive(true);
    });

    pickTarget();
  }, [pickTarget, startTimer]);

  const startGame = useCallback(
    (mins: number) => {
      timerSecondsRef.current = mins * 60;
      if (currentGame === 1) initGame1();
      else initGame2();
    },
    [currentGame, initGame1, initGame2],
  );

  const playAgain = useCallback(() => {
    setResultActive(false);
    initGame1();
  }, [initGame1]);

  const nextTarget = useCallback(() => {
    setWinActive(false);
    pickTarget();
  }, [pickTarget]);

  if (!apiKey) {
    return (
      <div id="screen-menu" className="screen active">
        <div className="menu-eyebrow">Richmond, Virginia</div>
        <div className="menu-title">
          RVA
          <br />
          <span>Street</span>
          <br />
          Games
        </div>
        <div className="api-key-error">
          Google Maps API key is not configured. Set{" "}
          <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your environment to
          play.
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        id="screen-menu"
        className={`screen${screen === "menu" ? " active" : ""}`}
      >
        <div className="menu-eyebrow">Richmond, Virginia</div>
        <div className="menu-title">
          RVA
          <br />
          <span>Street</span>
          <br />
          Games
        </div>
        <div className="menu-sub">
          Short Pump to Fulton &nbsp;·&nbsp; Glen Allen to Manchester
        </div>
        <div className="game-cards">
          <div
            className="game-card"
            onClick={() => selectGame(1)}
            onKeyDown={(e) => e.key === "Enter" && selectGame(1)}
            role="button"
            tabIndex={0}
          >
            <div className="card-num">01</div>
            <div className="card-name">GeoGuesser</div>
            <div className="card-desc">
              Drop into a random Richmond street view. Look around, place your
              pin, see how close you are.
            </div>
          </div>
          <div
            className="game-card"
            onClick={() => selectGame(2)}
            onKeyDown={(e) => e.key === "Enter" && selectGame(2)}
            role="button"
            tabIndex={0}
          >
            <div className="card-num">02</div>
            <div className="card-name">Navigator</div>
            <div className="card-desc">
              A business name pops up. Navigate the streets and find it. No map.
              Good luck.
            </div>
          </div>
        </div>
      </div>

      <div
        id="screen-timer"
        className={`screen${screen === "timer" ? " active" : ""}`}
      >
        <div className="timer-title">
          Pick a <span>{timerGameLabel}</span> timer
        </div>
        <div className="timer-options">
          {!mapsReady && (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>
              Loading maps…
            </p>
          )}
          <button
            type="button"
            className="timer-btn"
            disabled={!mapsReady}
            onClick={() => startGame(0)}
          >
            No Limit
          </button>
          <button
            type="button"
            className="timer-btn"
            disabled={!mapsReady}
            onClick={() => startGame(15)}
          >
            15 min
          </button>
          <button
            type="button"
            className="timer-btn"
            disabled={!mapsReady}
            onClick={() => startGame(10)}
          >
            10 min
          </button>
          <button
            type="button"
            className="timer-btn"
            disabled={!mapsReady}
            onClick={() => startGame(5)}
          >
            5 min
          </button>
        </div>
        <button type="button" className="back-btn" onClick={showMenu}>
          ← Back
        </button>
      </div>

      <div
        id="screen-game1"
        className={`screen${screen === "game1" ? " active" : ""}`}
      >
        <div id="sv-container1" ref={svContainer1Ref} />

        <div
          id="minimap-wrap"
          className={minimapExpanded ? "expanded" : undefined}
        >
          <button
            id="minimap-expand"
            type="button"
            onClick={() => setMinimapExpanded((v) => !v)}
          >
            ⤢
          </button>
          <div id="minimap" ref={minimapRef} />
        </div>

        {showGuessBtn && (
          <button
            id="guess-btn"
            type="button"
            style={{ display: "block" }}
            onClick={submitGuess}
          >
            GUESS
          </button>
        )}

        <div id="hud1">
          <div>
            <div className="hud-label">Score</div>
            <div className="hud-val" id="score-display">
              {scoreDisplay}
            </div>
          </div>
          <div
            id="timer-display1"
            className={timerWarning1 ? "timer-warning" : undefined}
          >
            {timerDisplay1}
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
            onClick={showMenu}
          >
            Menu
          </button>
        </div>
      </div>

      <div
        id="screen-game2"
        className={`screen${screen === "game2" ? " active" : ""}`}
      >
        <div id="sv-container2" ref={svContainer2Ref} />

        <div id="map2-container">
          <div id="target-card">
            <div id="target-name">{targetName}</div>
            <div id="target-address">{targetAddress}</div>
          </div>
          <div id="map2" ref={map2Ref} />
        </div>

        <div id="hud2">
          <div
            id="timer-display2"
            className={timerWarning2 ? "timer-warning" : undefined}
          >
            {timerDisplay2}
          </div>
          <div id="proximity-bar-wrap">
            <div className="prox-label">Proximity</div>
            <div id="proximity-bar-bg">
              <div
                id="proximity-bar-fill"
                style={{
                  width: `${proximityPct}%`,
                  background: proximityColor,
                }}
              />
            </div>
            <div id="proximity-text">{proximityText}</div>
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
            onClick={showMenu}
          >
            Menu
          </button>
        </div>
      </div>

      <div id="result-overlay" className={resultActive ? "active" : undefined}>
        <div id="result-box">
          <div id="result-title">{resultTitle}</div>
          <div id="result-score">{resultScore}</div>
          <div id="result-detail">{resultDetail}</div>
          <div className="result-actions">
            <button type="button" className="btn-primary" onClick={playAgain}>
              Play Again
            </button>
            <button type="button" className="btn-secondary" onClick={showMenu}>
              Menu
            </button>
          </div>
        </div>
      </div>

      <div id="win-overlay" className={winActive ? "active" : undefined}>
        <div id="win-box">
          <div id="win-title">{winTitle}</div>
          <div id="win-time">{winTime}</div>
          <div className="result-actions">
            <button type="button" className="btn-primary" onClick={nextTarget}>
              Next Target
            </button>
            <button type="button" className="btn-secondary" onClick={showMenu}>
              Menu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
