/* =====================================================
   MindTrack AI — script.js
   Vanilla JavaScript
   Connected to FastAPI /predict
===================================================== */

const CONFIG = {
    API_BASE_URL: "http://localhost:8000",
    PREDICT_ENDPOINT: "/predict"
};


/* =====================================================
   ELEMENT REFERENCES
===================================================== */

const form = document.getElementById("predict-form");

const submitBtn = document.getElementById("submit-btn");
const submitLabel = document.getElementById("submit-label");

const resetBtn = document.getElementById("reset-btn");
const retryBtn = document.getElementById("retry-btn");
const anotherBtn = document.getElementById("another-btn");

const states = {
    empty: document.getElementById("state-empty"),
    loading: document.getElementById("state-loading"),
    error: document.getElementById("state-error"),
    result: document.getElementById("state-result")
};

const errorMessageEl =
    document.getElementById("error-message");

const gaugeArc =
    document.getElementById("gauge-arc");

const scoreValueEl =
    document.getElementById("score-value");

const scoreCategoryEl =
    document.getElementById("score-category");

const scoreInterpretationEl =
    document.getElementById("score-interpretation");

const factorChipsEl =
    document.getElementById("factor-chips");


/* =====================================================
   GAUGE SETUP
===================================================== */

const GAUGE_ARC_LENGTH = gaugeArc.getTotalLength();

gaugeArc.style.strokeDasharray = GAUGE_ARC_LENGTH;
gaugeArc.style.strokeDashoffset = GAUGE_ARC_LENGTH;


/* =====================================================
   SHOW STATE
===================================================== */

function showState(name) {

    Object.values(states).forEach((state) => {
        state.classList.remove("is-active");
    });

    states[name].classList.add("is-active");
}


/* =====================================================
   BUTTON STATE
===================================================== */

function setSubmitting(isSubmitting) {

    submitBtn.disabled = isSubmitting;

    submitLabel.textContent = isSubmitting
        ? "Analyzing..."
        : "Predict mental health score";
}


/* =====================================================
   BUILD PAYLOAD
===================================================== */

function buildPayload() {

    return {

        Age: Number(
            document.getElementById("Age").value
        ),

        Gender:
            document.getElementById("Gender").value,

        Country:
            document.getElementById("Country").value.trim(),

        Academic_Level:
            document.getElementById("Academic_Level").value,

        Most_Used_Platform:
            document.getElementById("Most_Used_Platform").value,

        Purpose_Of_Use:
            document.getElementById("Purpose_Of_Use").value,

        Avg_Daily_Usage_Hours:
            Number(
                document.getElementById(
                    "Avg_Daily_Usage_Hours"
                ).value
            ),

        Daily_Unlocks:
            Number(
                document.getElementById(
                    "Daily_Unlocks"
                ).value
            ),

        Study_Hours:
            Number(
                document.getElementById(
                    "Study_Hours"
                ).value
            ),

        Physical_Activity_Hours:
            Number(
                document.getElementById(
                    "Physical_Activity_Hours"
                ).value
            ),

        Sleep_Hours_Per_Night:
            Number(
                document.getElementById(
                    "Sleep_Hours_Per_Night"
                ).value
            ),

        Stress_Level:
            document.getElementById(
                "Stress_Level"
            ).value
    };
}


/* =====================================================
   SEND REQUEST TO FASTAPI
===================================================== */

async function requestPrediction(payload) {

    const url =
        `${CONFIG.API_BASE_URL}${CONFIG.PREDICT_ENDPOINT}`;

    console.log("=================================");
    console.log("Sending request to:");
    console.log(url);

    console.log("Payload:");
    console.log(payload);
    console.log("=================================");


    const response = await fetch(url, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
    });


    /* -------------------------------------------------
       Handle HTTP errors
    ------------------------------------------------- */

    if (!response.ok) {

        let detail = "";

        try {

            const body = await response.json();

            console.error(
                "FastAPI returned error:",
                body
            );

            if (body.detail) {

                if (Array.isArray(body.detail)) {

                    detail = body.detail
                        .map(error => error.msg)
                        .join(", ");

                } else {

                    detail = body.detail;
                }
            }

        } catch (error) {

            console.error(
                "Could not read error response",
                error
            );
        }


        throw new Error(
            `Server responded with ${response.status}` +
            (detail ? ` — ${detail}` : "")
        );
    }


    const result = await response.json();

    console.log("Backend response:");
    console.log(result);

    return result;
}


/* =====================================================
   DISPLAY PREDICTION
===================================================== */

function renderResult(response, payload) {

    /*
       IMPORTANT:

       Backend response:

       {
           "predicted_mental_health_score": 7.2
       }
    */

    let score =
        Number(
            response.predicted_mental_health_score
        );


    /* -------------------------------------------------
       Check prediction
    ------------------------------------------------- */

    if (!Number.isFinite(score)) {

        throw new Error(
            "Backend did not return a valid mental health score."
        );
    }


    /*
       Your target is displayed on a 0–10 scale.

       We keep the prediction between 0 and 10
       only for the UI gauge.
    */

    score = Math.max(
        0,
        Math.min(10, score)
    );


    /* -------------------------------------------------
       Display score
    ------------------------------------------------- */

    scoreValueEl.textContent =
        score.toFixed(1);


    /* -------------------------------------------------
       Category
    ------------------------------------------------- */

    let category;
    let interpretation;

    if (score >= 7) {

        category = "Relatively high";

        interpretation =
            "Your model-estimated score is relatively high.";

    }

    else if (score >= 4) {

        category = "Around the middle";

        interpretation =
            "Your model-estimated score falls around the middle of the observed scale.";

    }

    else {

        category = "Relatively low";

        interpretation =
            "Your model-estimated score is relatively low.";
    }


    scoreCategoryEl.textContent = category;

    scoreInterpretationEl.textContent =
        interpretation;


    /* -------------------------------------------------
       Gauge
    ------------------------------------------------- */

    const percentage =
        score / 10;

    const offset =
        GAUGE_ARC_LENGTH -
        (GAUGE_ARC_LENGTH * percentage);


    gaugeArc.style.transition = "none";

    gaugeArc.style.strokeDashoffset =
        GAUGE_ARC_LENGTH;


    // Force browser reflow
    gaugeArc.getBoundingClientRect();


    gaugeArc.style.transition = "";


    requestAnimationFrame(() => {

        gaugeArc.style.strokeDashoffset =
            offset;

    });


    /* -------------------------------------------------
       Display input snapshot
    ------------------------------------------------- */

    displayInputPatterns(payload);


    /* -------------------------------------------------
       Show result
    ------------------------------------------------- */

    showState("result");
}


/* =====================================================
   INPUT PATTERN SNAPSHOT
===================================================== */

function displayInputPatterns(data) {

    factorChipsEl.innerHTML = "";


    const patterns = [

        {
            label: "Social media",
            value:
                `${data.Avg_Daily_Usage_Hours} hrs/day`
        },

        {
            label: "Daily unlocks",
            value:
                `${data.Daily_Unlocks}`
        },

        {
            label: "Study",
            value:
                `${data.Study_Hours} hrs/day`
        },

        {
            label: "Sleep",
            value:
                `${data.Sleep_Hours_Per_Night} hrs/night`
        },

        {
            label: "Activity",
            value:
                `${data.Physical_Activity_Hours} hrs/day`
        },

        {
            label: "Stress",
            value:
                data.Stress_Level
        }
    ];


    patterns.forEach((pattern) => {

        const chip =
            document.createElement("span");

        chip.className = "chip";

        chip.textContent =
            `${pattern.label}: ${pattern.value}`;

        factorChipsEl.appendChild(chip);
    });
}


/* =====================================================
   SHOW ERROR
===================================================== */

function showError(error) {

    console.error(
        "Prediction error:",
        error
    );


    errorMessageEl.textContent =
        error.message ||
        "Something went wrong while contacting the backend.";


    showState("error");
}


/* =====================================================
   FORM SUBMIT
===================================================== */

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        /* ---------------------------------------------
           Browser validation
        --------------------------------------------- */

        if (!form.reportValidity()) {

            return;
        }


        /* ---------------------------------------------
           Build exact backend payload
        --------------------------------------------- */

        const payload =
            buildPayload();


        /* ---------------------------------------------
           Loading state
        --------------------------------------------- */

        setSubmitting(true);

        showState("loading");


        try {

            /* -----------------------------------------
               Call FastAPI
            ----------------------------------------- */

            const response =
                await requestPrediction(payload);


            /* -----------------------------------------
               Display prediction
            ----------------------------------------- */

            renderResult(
                response,
                payload
            );

        }

        catch (error) {

            showError(error);

        }

        finally {

            setSubmitting(false);
        }
    }
);


/* =====================================================
   RESET
===================================================== */

resetBtn.addEventListener(
    "click",
    () => {

        form.reset();

        showState("empty");

        factorChipsEl.innerHTML = "";

        scoreValueEl.textContent = "--";

        scoreCategoryEl.textContent = "—";

        scoreInterpretationEl.textContent = "";

        gaugeArc.style.strokeDashoffset =
            GAUGE_ARC_LENGTH;
    }
);


/* =====================================================
   RETRY
===================================================== */

retryBtn.addEventListener(
    "click",
    () => {

        form.requestSubmit();

    }
);


/* =====================================================
   ANOTHER PREDICTION
===================================================== */

anotherBtn.addEventListener(
    "click",
    () => {

        showState("empty");

        const firstInput =
            form.querySelector("input, select");

        if (firstInput) {

            firstInput.focus();
        }
    }
);


/* =====================================================
   INITIAL STATE
===================================================== */

showState("empty");


/* =====================================================
   LUCIDE ICONS
===================================================== */

if (window.lucide) {

    window.lucide.createIcons();
}