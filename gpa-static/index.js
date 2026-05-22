// GPA Auto Calculator Application Logic
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize State
    // Load history semesters from localStorage or default to initialData
    let historySemesters;
    const savedHistory = localStorage.getItem("gpa_history_semesters");
    if (savedHistory) {
        try {
            historySemesters = JSON.parse(savedHistory);
        } catch (e) {
            historySemesters = initialData.history.slice(0, -1);
        }
    } else {
        historySemesters = initialData.history.slice(0, -1);
    }

    // Load current semester name
    let currentSemesterName;
    const savedCurrentSemName = localStorage.getItem("gpa_current_semester_name");
    if (savedCurrentSemName) {
        currentSemesterName = savedCurrentSemName;
    } else {
        currentSemesterName = initialData.history[initialData.history.length - 1].name;
    }

    // Load current semester courses
    let currentSemesterCourses = [];
    const savedGrades = localStorage.getItem("gpa_current_grades");
    
    // Check if the current semester is the default one or a user-created one
    const defaultLastSem = initialData.history[initialData.history.length - 1];
    const defaultCourses = defaultLastSem.courses;
    
    if (savedGrades) {
        try {
            currentSemesterCourses = JSON.parse(savedGrades);
            // If it is the default semester, sync missing courses
            if (currentSemesterName === defaultLastSem.name) {
                defaultCourses.forEach(dc => {
                    if (!currentSemesterCourses.some(c => c.code === dc.code)) {
                        currentSemesterCourses.push({ ...dc });
                    }
                });
            }
        } catch (e) {
            currentSemesterCourses = currentSemesterName === defaultLastSem.name ? defaultCourses.map(c => ({ ...c })) : [];
        }
    } else {
        currentSemesterCourses = currentSemesterName === defaultLastSem.name ? defaultCourses.map(c => ({ ...c })) : [];
    }

    let appState = {
        curriculum: initialData.curriculum,
        historySemesters: historySemesters,
        currentSemesterName: currentSemesterName,
        currentSemesterCourses: currentSemesterCourses
    };

    // 2. DOM Elements
    const overallAcademicGpaEl = document.getElementById("overall-academic-gpa");
    const overallAcademicGpa10El = document.getElementById("overall-academic-gpa-10");
    const overallScholarshipGpaEl = document.getElementById("overall-scholarship-gpa");
    const overallClassificationEl = document.getElementById("overall-classification");
    const overallCreditsEl = document.getElementById("overall-credits");
    const creditsProgressEl = document.getElementById("credits-progress");
    const currentCoursesListEl = document.getElementById("current-courses-list");
    const currentAcademicGpaEl = document.getElementById("current-academic-gpa");
    const currentScholarshipGpaEl = document.getElementById("current-scholarship-gpa");
    const currentCreditsEl = document.getElementById("current-credits");
    const currentSemTitleEl = document.getElementById("current-sem-title");
    const historyAccordionEl = document.getElementById("history-accordion");
    const retakeListEl = document.getElementById("retake-list");
    
    // Modal & search elements
    const electiveModalEl = document.getElementById("elective-modal");
    const btnAddElectiveEl = document.getElementById("btn-add-elective");
    const btnCloseModalEl = document.getElementById("btn-close-modal");
    const searchCourseEl = document.getElementById("search-course");
    const searchResultsListEl = document.getElementById("search-results-list");
    const customCodeEl = document.getElementById("custom-code");
    const customNameEl = document.getElementById("custom-name");
    const customCreditsEl = document.getElementById("custom-credits");
    const btnAddCustomSubmitEl = document.getElementById("btn-add-custom-submit");
    const btnClearGradesEl = document.getElementById("btn-clear-grades");
    const btnNextSemesterEl = document.getElementById("btn-next-semester");
    const btnResetAllEl = document.getElementById("btn-reset-all");

    // Set Header Info
    currentSemTitleEl.textContent = appState.currentSemesterName;

    // 3. Helper Functions for Grade Conversions
    function getLetterGrade(numericGrade) {
        if (numericGrade === "" || numericGrade === null || numericGrade === undefined) return "";
        const val = parseFloat(numericGrade);
        if (isNaN(val)) {
            // Check for non-numeric passed grades
            const cleanVal = String(numericGrade).trim().toUpperCase();
            if (cleanVal === "DT" || cleanVal === "ĐẠT" || cleanVal === "M") return "--";
            return "";
        }
        if (val < 4.0) return "F";
        if (val < 5.0) return "D";
        if (val < 5.5) return "D+";
        if (val < 6.5) return "C";
        if (val < 7.0) return "C+";
        if (val < 8.0) return "B";
        if (val < 8.5) return "B+";
        if (val < 9.5) return "A";
        return "A+";
    }

    function getAcademicGradePoint(letterGrade) {
        switch (letterGrade) {
            case "A+": return 4.0;
            case "A":  return 4.0;
            case "B+": return 3.5;
            case "B":  return 3.0;
            case "C+": return 2.5;
            case "C":  return 2.0;
            case "D+": return 1.5;
            case "D":  return 1.0;
            case "F":  return 0.0;
            default:   return null;
        }
    }

    function getScholarshipGradePoint(letterGrade) {
        switch (letterGrade) {
            case "A+": return 4;
            case "A":  return 4;
            case "B+": return 3;
            case "B":  return 3;
            case "C+": return 2;
            case "C":  return 2;
            case "D+": return 1;
            case "D":  return 1;
            case "F":  return 0;
            default:   return null;
        }
    }

    function getClassification(gpa) {
        if (gpa >= 3.6) return "Xuất sắc (Excellent)";
        if (gpa >= 3.2) return "Giỏi (Very Good)";
        if (gpa >= 2.5) return "Khá (Good)";
        if (gpa >= 2.0) return "Trung bình (Average)";
        if (gpa >= 1.0) return "Yếu (Weak)";
        return "Kém (Poor)";
    }

    // 4. Recalculation Engine
    function calculateGPA() {
        // Collect all course attempts chronologically
        // A course object in this list: { code, name, credits, grade, letterGrade, academicGP, scholarshipGP, semesterName, semesterType, semIndex, retake, original }
        let allAttempts = [];

        // Add history semesters
        appState.historySemesters.forEach((sem, semIdx) => {
            sem.courses.forEach(c => {
                const numericGrade = c.grade;
                const letterGrade = c.letter_grade || getLetterGrade(numericGrade);
                allAttempts.push({
                    code: c.code,
                    name: c.name,
                    credits: c.credits,
                    grade: numericGrade,
                    letterGrade: letterGrade,
                    academicGP: getAcademicGradePoint(letterGrade),
                    scholarshipGP: getScholarshipGradePoint(letterGrade),
                    semesterName: sem.name,
                    semesterType: 'history',
                    semIndex: semIdx,
                    retake: c.retake || "",
                    original: c
                });
            });
        });

        // Add current semester
        appState.currentSemesterCourses.forEach(c => {
            const numericGrade = c.grade;
            const letterGrade = getLetterGrade(numericGrade);
            allAttempts.push({
                code: c.code,
                name: c.name,
                credits: c.credits,
                grade: numericGrade,
                letterGrade: letterGrade,
                academicGP: getAcademicGradePoint(letterGrade),
                scholarshipGP: getScholarshipGradePoint(letterGrade),
                semesterName: appState.currentSemesterName,
                semesterType: 'current',
                semIndex: appState.historySemesters.length,
                retake: "",
                original: c
            });
        });

        // Resolve Retakes (Học lại / Cải thiện)
        // Group by course code
        let courseGroups = {};
        allAttempts.forEach((attempt, index) => {
            if (!courseGroups[attempt.code]) {
                courseGroups[attempt.code] = [];
            }
            courseGroups[attempt.code].push({ attempt, index });
        });

        let retakeMap = []; // Stores info about mapped retakes

        // Process each course group to flag older attempts as replaced
        Object.keys(courseGroups).forEach(code => {
            const group = courseGroups[code];
            if (group.length > 1) {
                // Find the index of the latest attempt in the group that has a valid grade
                let latestGradedIdx = -1;
                for (let i = group.length - 1; i >= 0; i--) {
                    const grade = group[i].attempt.grade;
                    if (grade !== "" && grade !== null && grade !== undefined) {
                        latestGradedIdx = i;
                        break;
                    }
                }

                if (latestGradedIdx !== -1) {
                    // The latest graded attempt replaces all previous attempts
                    const latestGradedAttempt = group[latestGradedIdx].attempt;
                    group.forEach((item, i) => {
                        if (i < latestGradedIdx) {
                            item.attempt.isReplaced = true;
                            
                            // Log retake details for visualizer
                            retakeMap.push({
                                code: code,
                                name: latestGradedAttempt.name,
                                oldSem: item.attempt.semesterName,
                                oldGrade: item.attempt.grade + " (" + item.attempt.letterGrade + ")",
                                newSem: latestGradedAttempt.semesterName,
                                newGrade: latestGradedAttempt.grade + " (" + latestGradedAttempt.letterGrade + ")"
                            });
                        } else {
                            item.attempt.isReplaced = false;
                        }
                    });
                } else {
                    // No attempts are graded yet
                    group.forEach(item => {
                        item.attempt.isReplaced = false;
                    });
                }
            } else {
                group[0].attempt.isReplaced = false;
            }
        });

        // Recalculate Semester GPAs
        // We'll prepare an array for each semester
        let semesterStats = Array(appState.historySemesters.length + 1).fill(null).map(() => ({
            name: "",
            sumPointsAcademic: 0,
            sumPointsScholarship: 0,
            sumCredits: 0,
            sumGrade10: 0,
            sumGrade10Credits: 0,
            gpaAcademic: 0,
            gpaScholarship: 0,
            gpaGrade10: 0,
            creditsEarned: 0
        }));

        // Set names
        appState.historySemesters.forEach((sem, idx) => {
            semesterStats[idx].name = sem.name;
        });
        semesterStats[appState.historySemesters.length].name = appState.currentSemesterName;

        allAttempts.forEach(att => {
            let stats = semesterStats[att.semIndex];
            
            // For Semester GPA, we count everything in that semester regardless of retakes
            if (att.grade !== "" && att.grade !== null) {
                const numericGrade = parseFloat(att.grade);
                
                if (!isNaN(numericGrade)) {
                    // Graded courses
                    stats.sumPointsAcademic += att.academicGP * att.credits;
                    stats.sumPointsScholarship += att.scholarshipGP * att.credits;
                    stats.sumCredits += att.credits;
                    
                    stats.sumGrade10 += numericGrade * att.credits;
                    stats.sumGrade10Credits += att.credits;
                    
                    if (att.letterGrade !== "F") {
                        stats.creditsEarned += att.credits;
                    }
                } else {
                    // Non-numeric grade (like "DT")
                    const cleanVal = String(att.grade).trim().toUpperCase();
                    if (cleanVal === "DT" || cleanVal === "ĐẠT" || cleanVal === "M") {
                        stats.creditsEarned += att.credits;
                    }
                }
            }
        });

        // Compute averages for each semester
        semesterStats.forEach(stats => {
            if (stats.sumCredits > 0) {
                stats.gpaAcademic = stats.sumPointsAcademic / stats.sumCredits;
                stats.gpaScholarship = stats.sumPointsScholarship / stats.sumCredits;
            }
            if (stats.sumGrade10Credits > 0) {
                stats.gpaGrade10 = stats.sumGrade10 / stats.sumGrade10Credits;
            }
        });

        // Calculate CUMULATIVE GPA (Passed courses / Latest attempts only)
        // 1. True Academic GPA: latest attempt of all taken courses, failed courses ARE included in denominator.
        let cumAcademicPoints = 0;
        let cumAcademicCredits = 0;
        let cumGrade10Points = 0;
        let cumGrade10Credits = 0;

        // 2. Scholarship GPA (Excel calculation: sum of M divided by sum of N)
        // Note: In Excel, failed courses have N = 0, so they are excluded from the denominator.
        let cumScholarshipPoints = 0;
        let cumScholarshipCredits = 0;
        
        let cumTotalPassedCredits = 0; // Total credits successfully earned

        allAttempts.forEach(att => {
            // Excel row evaluation
            const D = att.credits;
            const L = att.isReplaced ? "ct" : att.retake;
            
            // Calculate H and I for this attempt
            const originalHasGrade = (att.grade !== "" && att.grade !== null && att.grade !== undefined);
            const isNumericOriginal = originalHasGrade && !isNaN(parseFloat(att.grade));
            
            let H = 0;
            let I = 0;
            if (D > 0 && originalHasGrade && att.letterGrade !== "--") {
                H = att.scholarshipGP * D;
                if (att.letterGrade !== "F") {
                    I = D;
                }
            }

            // Calculate M and N based on L (retake)
            let M = 0;
            let N = 0;
            if (L === "ct") {
                M = 0;
                N = 0;
            } else if (L === "") {
                M = H;
                N = I;
            } else {
                // L is a grade (e.g. 5.5)
                const retakeLetter = getLetterGrade(L);
                const retakeGP = getScholarshipGradePoint(retakeLetter);
                M = retakeGP * D;
                N = I; // Excel bug: N = I
            }

            // Calculate Academic H and D for this attempt
            let acadH = 0;
            let acadD = 0;
            if (!att.isReplaced) {
                if (D > 0 && originalHasGrade && att.letterGrade !== "--") {
                    if (L === "") {
                        acadH = att.academicGP * D;
                        acadD = D;
                    } else if (L !== "ct") {
                        const retakeLetter = getLetterGrade(L);
                        const retakeAcadGP = getAcademicGradePoint(retakeLetter);
                        acadH = retakeAcadGP * D;
                        acadD = D;
                    }
                }
            }

            // Accumulate Scholarship GPA
            cumScholarshipPoints += M;
            cumScholarshipCredits += N;

            // Accumulate Academic GPA
            if (!att.isReplaced) {
                cumAcademicPoints += acadH;
                cumAcademicCredits += acadD;

                if (originalHasGrade) {
                    if (isNumericOriginal) {
                        const numericGrade = parseFloat(att.grade);
                        let finalGrade10 = numericGrade;
                        if (L !== "" && L !== "ct" && !isNaN(parseFloat(L))) {
                            finalGrade10 = parseFloat(L);
                        }
                        cumGrade10Points += finalGrade10 * D;
                        cumGrade10Credits += D;
                    }
                }
            }

            // Total credits successfully earned
            if (!att.isReplaced) {
                let passed = false;
                if (originalHasGrade) {
                    if (att.letterGrade !== "F" && att.letterGrade !== "") {
                        passed = true;
                    } else if (L !== "" && L !== "ct") {
                        const retakeLetter = getLetterGrade(L);
                        if (retakeLetter !== "F" && retakeLetter !== "") {
                            passed = true;
                        }
                    }
                }
                if (passed) {
                    cumTotalPassedCredits += D;
                }
            }
        });

        const overallAcademicGPA = cumAcademicCredits > 0 ? (cumAcademicPoints / cumAcademicCredits) : 0;
        const overallAcademicGPA10 = cumGrade10Credits > 0 ? (cumGrade10Points / cumGrade10Credits) : 0;
        const overallScholarshipGPA = cumScholarshipCredits > 0 ? (cumScholarshipPoints / cumScholarshipCredits) : 0;

        // Update DOM elements
        overallAcademicGpaEl.textContent = overallAcademicGPA.toFixed(2);
        overallAcademicGpa10El.textContent = `Hệ 10: ${overallAcademicGPA10.toFixed(2)} | Hệ 4 (Tích lũy): ${overallAcademicGPA.toFixed(2)}`;
        overallScholarshipGpaEl.textContent = overallScholarshipGPA.toFixed(2);
        overallClassificationEl.textContent = `Xếp loại: ${getClassification(overallScholarshipGPA)}`;
        
        overallCreditsEl.textContent = cumTotalPassedCredits;
        const progressPercent = Math.min(100, (cumTotalPassedCredits / 128) * 100);
        creditsProgressEl.style.width = `${progressPercent}%`;

        // Update current semester display card
        const currentSemStats = semesterStats[appState.historySemesters.length];
        currentAcademicGpaEl.textContent = currentSemStats.gpaAcademic.toFixed(2);
        currentScholarshipGpaEl.textContent = currentSemStats.gpaScholarship.toFixed(2);
        currentCreditsEl.textContent = `${currentSemStats.creditsEarned} / ${currentSemStats.sumCredits} TC`;

        // Update retake mappings list in footer
        renderRetakeList(retakeMap);

        // Return stats so they can be used for accordion renders
        return {
            semesterStats,
            allAttempts
        };
    }

    // 5. Render Functions
    function renderCurrentSemester() {
        currentCoursesListEl.innerHTML = "";
        
        appState.currentSemesterCourses.forEach((course, index) => {
            const letter = getLetterGrade(course.grade);
            const isF = (letter === "F");
            const hasGrade = (course.grade !== "");
            
            // Check if this course is a retake of a previous semester's course
            const isRetake = appState.historySemesters.some(sem => 
                sem.courses.some(c => c.code === course.code)
            );

            const row = document.createElement("div");
            row.className = `course-input-row ${isRetake ? 'retake-active' : ''}`;
            row.innerHTML = `
                <div class="course-info-col">
                    <div class="course-name-row">
                        <span class="course-code">${course.code}</span>
                        <span class="course-name" title="${course.name}">${course.name}</span>
                    </div>
                    <div class="course-meta">
                        <span class="course-meta-credits">${course.credits} TC</span>
                        ${isRetake ? `<span class="badge-retake-notice"><i class="fa-solid fa-arrows-rotate"></i> Học lại / Cải thiện</span>` : ''}
                    </div>
                </div>
                <div class="course-grade-col">
                    <div class="input-number-wrapper">
                        <input type="text" class="input-grade" data-index="${index}" value="${course.grade}" placeholder="-.-">
                    </div>
                    <div class="grade-badge-display ${hasGrade ? (isF ? 'grade-F' : 'grade-pass') : 'grade-empty'}">
                        ${letter || "-"}
                    </div>
                    ${course.isCustom ? `
                        <button class="btn-remove-course" data-index="${index}" title="Xóa môn tự chọn này">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    ` : ''}
                </div>
            `;
            currentCoursesListEl.appendChild(row);
        });

        // Bind input events
        const inputs = currentCoursesListEl.querySelectorAll(".input-grade");
        inputs.forEach(input => {
            input.addEventListener("input", (e) => {
                const idx = parseInt(e.target.dataset.index);
                let val = e.target.value;
                
                // Strict regex validation for typed characters (allowing partial inputs)
                const partialRegex = /^(10(\.0*)?|[0-9](\.[0-9]*)?|D|DT)?$/i;
                
                if (!partialRegex.test(val)) {
                    // Revert to the last saved value if invalid
                    e.target.value = appState.currentSemesterCourses[idx].grade;
                    return;
                }
                
                // Update appState
                appState.currentSemesterCourses[idx].grade = val;
                
                // Save to localStorage
                localStorage.setItem("gpa_current_grades", JSON.stringify(appState.currentSemesterCourses));
                
                // Recalculate and update current row badge without full re-render for performance
                const calcResults = calculateGPA();
                const letter = getLetterGrade(appState.currentSemesterCourses[idx].grade);
                const badge = e.target.closest(".course-input-row").querySelector(".grade-badge-display");
                badge.className = `grade-badge-display ${appState.currentSemesterCourses[idx].grade !== "" ? (letter === "F" ? 'grade-F' : 'grade-pass') : 'grade-empty'}`;
                badge.textContent = letter || "-";
                
                // Dynamically refresh history rows and statuses
                renderHistory(calcResults.semesterStats, calcResults.allAttempts);
            });
        });

        // Bind delete custom course events
        const deleteBtns = currentCoursesListEl.querySelectorAll(".btn-remove-course");
        deleteBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                appState.currentSemesterCourses.splice(idx, 1);
                localStorage.setItem("gpa_current_grades", JSON.stringify(appState.currentSemesterCourses));
                renderCurrentSemester();
                const calcResults = calculateGPA();
                renderHistory(calcResults.semesterStats, calcResults.allAttempts);
            });
        });
    }

    function renderHistory(semesterStats, allAttempts) {
        // Find which semesters are currently expanded (active class)
        const activeSemNames = Array.from(historyAccordionEl.querySelectorAll(".accordion-item.active"))
            .map(item => item.querySelector(".acc-title").textContent);

        historyAccordionEl.innerHTML = "";

        appState.historySemesters.forEach((sem, semIdx) => {
            const stats = semesterStats[semIdx];
            
            // Build courses rows
            let rowsHtml = "";
            sem.courses.forEach(c => {
                const numericGrade = c.grade;
                const letterGrade = c.letter_grade || getLetterGrade(numericGrade);
                const isF = (letterGrade === "F");
                
                // Find if this attempt was replaced
                const attemptInfo = allAttempts.find(att => att.original === c);
                const isReplaced = attemptInfo ? attemptInfo.isReplaced : false;
                
                // Find if this course has a newer attempt
                const codeCount = allAttempts.filter(att => att.code === c.code).length;
                
                rowsHtml += `
                    <tr>
                        <td class="col-code">${c.code}</td>
                        <td class="col-name">${c.name}</td>
                        <td class="col-credits">${c.credits}</td>
                        <td class="col-grade">${numericGrade || "--"}</td>
                        <td class="col-letter text-center">
                            <span class="txt-grade-${letterGrade.replace('+', 'p')}">${letterGrade || "--"}</span>
                        </td>
                        <td class="col-actions">
                            ${isReplaced ? `<span class="badge-replaced" title="Môn này đã được học lại và thay thế bằng điểm mới nhất"><i class="fa-solid fa-ban"></i> Đã thay thế</span>` : ''}
                            ${(!isReplaced && codeCount > 1 && numericGrade !== "") ? `<span class="badge-has-retake" title="Môn học lại dùng điểm này làm chính thức"><i class="fa-solid fa-check-double"></i> Điểm mới nhất</span>` : ''}
                        </td>
                    </tr>
                `;
            });

            const isActive = activeSemNames.includes(sem.name);

            const accItem = document.createElement("div");
            accItem.className = `accordion-item ${isActive ? 'active' : ''}`;
            accItem.innerHTML = `
                <div class="accordion-header">
                    <div class="acc-title-col">
                        <span class="acc-title">${sem.name}</span>
                        <div class="acc-summary-row">
                            <span>ĐTB Học kỳ: <span>${stats.gpaAcademic.toFixed(2)}</span></span>
                            <span>Tín chỉ đạt: <span>${stats.creditsEarned} TC</span></span>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-down acc-chevron"></i>
                </div>
                <div class="accordion-body-wrapper">
                    <div class="accordion-body">
                        <div class="history-table-wrapper">
                            <table class="history-table">
                                <thead>
                                    <tr>
                                        <th>Mã Môn</th>
                                        <th>Tên Môn Học</th>
                                        <th class="text-center">Số TC</th>
                                        <th class="text-center">Điểm Hệ 10</th>
                                        <th class="text-center">Điểm Chữ</th>
                                        <th class="text-center">Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rowsHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            
            // Toggle accordion
            accItem.querySelector(".accordion-header").addEventListener("click", () => {
                accItem.classList.toggle("active");
            });

            historyAccordionEl.appendChild(accItem);
        });
    }

    function renderRetakeList(retakeMap) {
        retakeListEl.innerHTML = "";
        
        if (retakeMap.length === 0) {
            retakeListEl.innerHTML = `<p class="no-retakes-text">Không phát hiện môn học lại nào.</p>`;
            return;
        }

        retakeMap.forEach(map => {
            const item = document.createElement("div");
            item.className = "retake-mapping-item";
            item.innerHTML = `
                <div class="retake-map-info">
                    <span class="retake-map-code">${map.code}</span>
                    <span class="retake-map-name">${map.name}</span>
                </div>
                <div class="retake-map-flow">
                    <span>Học kỳ cũ: <span class="retake-old-grade">${map.oldGrade}</span> (${map.oldSem})</span>
                    <i class="fa-solid fa-arrow-right-long" style="color: var(--color-warning)"></i>
                    <span>Mới nhất: <span class="retake-new-grade">${map.newGrade}</span> (${map.newSem})</span>
                </div>
                <span class="retake-impact-text"><i class="fa-solid fa-circle-check"></i> Đã quy đổi thay thế</span>
            `;
            retakeListEl.appendChild(item);
        });
    }

    // 6. Modal & Search Actions
    btnAddElectiveEl.addEventListener("click", () => {
        searchCourseEl.value = "";
        searchResultsListEl.innerHTML = `<p class="no-results-msg">Nhập mã môn hoặc tên môn để tìm kiếm...</p>`;
        electiveModalEl.classList.add("active");
    });

    btnCloseModalEl.addEventListener("click", () => {
        electiveModalEl.classList.remove("active");
    });

    // Close modal when clicking outside the modal content
    electiveModalEl.addEventListener("click", (e) => {
        if (e.target === electiveModalEl) {
            electiveModalEl.classList.remove("active");
        }
    });

    // Curriculum search filter
    searchCourseEl.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        searchResultsListEl.innerHTML = "";

        if (query.length < 2) {
            searchResultsListEl.innerHTML = `<p class="no-results-msg">Nhập ít nhất 2 ký tự...</p>`;
            return;
        }

        let matches = [];
        Object.keys(appState.curriculum).forEach(code => {
            const course = appState.curriculum[code];
            if (code.toLowerCase().includes(query) || course.name.toLowerCase().includes(query)) {
                // Check if already in current semester courses
                const isAlreadyAdded = appState.currentSemesterCourses.some(c => c.code === code);
                matches.push({ code, ...course, isAlreadyAdded });
            }
        });

        if (matches.length === 0) {
            searchResultsListEl.innerHTML = `<p class="no-results-msg">Không tìm thấy môn học nào.</p>`;
            return;
        }

        matches.slice(0, 10).forEach(course => {
            const li = document.createElement("li");
            li.className = "search-result-item";
            li.innerHTML = `
                <div class="res-course-title">
                    <span class="res-code">${course.code}</span>
                    <span class="res-name">${course.name}</span>
                </div>
                <div class="course-grade-col">
                    <span class="res-meta">${course.credits} TC</span>
                    ${course.isAlreadyAdded ? 
                        `<span style="color: var(--text-muted); font-size:12px; font-weight:600;"><i class="fa-solid fa-check"></i> Đã thêm</span>` : 
                        `<button class="btn btn-secondary btn-sm btn-add-result" style="padding:6px 12px; font-size:12px;"><i class="fa-solid fa-plus"></i> Thêm</button>`
                    }
                </div>
            `;

            if (!course.isAlreadyAdded) {
                li.querySelector(".btn-add-result").addEventListener("click", () => {
                    appState.currentSemesterCourses.push({
                        code: course.code,
                        name: course.name,
                        credits: course.credits,
                        grade: "",
                        isCustom: true // marked so we can remove it if needed
                    });
                    
                    localStorage.setItem("gpa_current_grades", JSON.stringify(appState.currentSemesterCourses));
                    renderCurrentSemester();
                    const calcResults = calculateGPA();
                    renderHistory(calcResults.semesterStats, calcResults.allAttempts);
                    
                    // Show animation / toast or close modal
                    electiveModalEl.classList.remove("active");
                });
            }

            searchResultsListEl.appendChild(li);
        });
    });

    // Custom Course addition
    btnAddCustomSubmitEl.addEventListener("click", () => {
        const code = customCodeEl.value.trim().toUpperCase();
        const name = customNameEl.value.trim();
        const credits = parseInt(customCreditsEl.value);

        if (!code || !name || isNaN(credits)) {
            alert("Vui lòng nhập đầy đủ Mã môn, Tên môn và Số tín chỉ.");
            return;
        }

        // Check if duplicate
        if (appState.currentSemesterCourses.some(c => c.code === code)) {
            alert("Môn học này đã có trong danh sách học kỳ hiện tại.");
            return;
        }

        appState.currentSemesterCourses.push({
            code: code,
            name: name,
            credits: credits,
            grade: "",
            isCustom: true
        });

        localStorage.setItem("gpa_current_grades", JSON.stringify(appState.currentSemesterCourses));
        
        // Reset form
        customCodeEl.value = "";
        customNameEl.value = "";
        customCreditsEl.value = "3";
        
        renderCurrentSemester();
        const calcResults = calculateGPA();
        renderHistory(calcResults.semesterStats, calcResults.allAttempts);
        
        electiveModalEl.classList.remove("active");
    });

    // Clear all grades button
    btnClearGradesEl.addEventListener("click", () => {
        if (confirm("Bạn có chắc chắn muốn xóa toàn bộ điểm đã nhập của học kỳ hiện tại không?")) {
            appState.currentSemesterCourses.forEach(c => {
                c.grade = "";
            });
            localStorage.setItem("gpa_current_grades", JSON.stringify(appState.currentSemesterCourses));
            renderCurrentSemester();
            const calcResults = calculateGPA();
            renderHistory(calcResults.semesterStats, calcResults.allAttempts);
        }
    });

    // Start Next Semester Action
    if (btnNextSemesterEl) {
        btnNextSemesterEl.addEventListener("click", () => {
            // First check if they have entered grades in the current semester
            const hasGrades = appState.currentSemesterCourses.some(c => c.grade !== "");
            if (!hasGrades) {
                const proceed = confirm("Học kỳ hiện tại chưa được nhập điểm nào. Bạn có chắc chắn muốn chuyển sang học kỳ mới không?");
                if (!proceed) return;
            }

            // Prompt for new semester name
            // Let's suggest the next semester name based on the current one if possible
            let suggestedName = "Học kỳ mới";
            const match = appState.currentSemesterName.match(/Học kỳ (\d) Năm học (\d{4}) - (\d{4})/i);
            if (match) {
                const currentTerm = parseInt(match[1]);
                const startYear = parseInt(match[2]);
                const endYear = parseInt(match[3]);
                if (currentTerm === 1) {
                    suggestedName = `Học kỳ 2 Năm học ${startYear} - ${endYear}`;
                } else if (currentTerm === 2) {
                    suggestedName = `Học kỳ 3 Năm học ${startYear} - ${endYear}`;
                } else {
                    suggestedName = `Học kỳ 1 Năm học ${startYear + 1} - ${endYear + 1}`;
                }
            }

            const newSemName = prompt("Nhập tên học kỳ mới:", suggestedName);
            if (!newSemName || newSemName.trim() === "") return;

            // 1. Move current semester to history
            const archivedCourses = appState.currentSemesterCourses.map(c => {
                const letter = getLetterGrade(c.grade);
                return {
                    code: c.code,
                    name: c.name,
                    credits: c.credits,
                    grade: c.grade,
                    letter_grade: letter || "--",
                    retake: ""
                };
            });

            appState.historySemesters.push({
                name: appState.currentSemesterName,
                courses: archivedCourses
            });

            // 2. Set new semester as current
            appState.currentSemesterName = newSemName.trim();
            appState.currentSemesterCourses = [];

            // 3. Save everything to localStorage
            localStorage.setItem("gpa_history_semesters", JSON.stringify(appState.historySemesters));
            localStorage.setItem("gpa_current_semester_name", appState.currentSemesterName);
            localStorage.setItem("gpa_current_grades", JSON.stringify(appState.currentSemesterCourses));

            // 4. Update UI
            currentSemTitleEl.textContent = appState.currentSemesterName;
            renderCurrentSemester();
            const calcResults = calculateGPA();
            renderHistory(calcResults.semesterStats, calcResults.allAttempts);
            
            alert(`Đã chuyển sang ${appState.currentSemesterName}. Điểm của học kỳ trước đã được lưu vào lịch sử.`);
        });
    }

    // Reset All Data Action
    if (btnResetAllEl) {
        btnResetAllEl.addEventListener("click", () => {
            const proceed = confirm("CẢNH BÁO: Hành động này sẽ xóa toàn bộ điểm bạn đã nhập và khôi phục dữ liệu gốc ban đầu từ file Excel. Bạn có chắc chắn muốn tiếp tục không?");
            if (!proceed) return;

            localStorage.removeItem("gpa_history_semesters");
            localStorage.removeItem("gpa_current_semester_name");
            localStorage.removeItem("gpa_current_grades");

            // Reload page to reinitialize state
            window.location.reload();
        });
    }

    // 7. Initial Run
    renderCurrentSemester();
    const { semesterStats, allAttempts } = calculateGPA();
    renderHistory(semesterStats, allAttempts);
});
