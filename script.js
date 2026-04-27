/***********************************************************************
  Shared Application Logic (script.js)
  All data is static — no backend required.
  Enrollments persist across pages via localStorage.
************************************************************************/


/***********************************************************************
  1) Static Data
************************************************************************/

const STUDENTS = [
  { username: 'Jsmith',    password: 'password123', studentId: 'STU101', firstName: 'Joe',   lastName: 'Smith',    completedCourses: [] },
  { username: 'Ajohnson',  password: 'password123', studentId: 'STU102', firstName: 'Alice', lastName: 'Johnson',  completedCourses: ['CS101'] },
  { username: 'Bwilliams', password: 'password123', studentId: 'STU103', firstName: 'Bob',   lastName: 'Williams', completedCourses: ['CS101', 'MATH101'] },
];

const INSTRUCTORS = [
  { id: 'INST01', name: 'Dr. Johnson'   },
  { id: 'INST02', name: 'Prof. Williams'},
  { id: 'INST03', name: 'Dr. Brown'     },
  { id: 'INST04', name: 'Dr. Martinez'  },
  { id: 'INST05', name: 'Prof. Davis'   },
  { id: 'INST06', name: 'Dr. Thompson'  },
  { id: 'INST07', name: 'Prof. Anderson'},
  { id: 'INST08', name: 'Dr. Wilson'    },
  { id: 'INST09', name: 'Prof. Garcia'  },
  { id: 'INST10', name: 'Dr. Lee'       },
  { id: 'INST11', name: 'Prof. Harris'  },
  { id: 'INST12', name: 'Dr. Clark'     },
];

const COURSES = [
  // Computer Science
  { id: 'CS101',  dept: 'CS',   number: '101', title: 'Intro to Computer Science',  credits: 3, prereq: 'None',   prereqId: null,      modality: 'In-Person', max: 30 },
  { id: 'CS201',  dept: 'CS',   number: '201', title: 'Data Structures',            credits: 3, prereq: 'CS101',  prereqId: 'CS101',   modality: 'In-Person', max: 25 },
  { id: 'CS301',  dept: 'CS',   number: '301', title: 'Algorithms',                 credits: 3, prereq: 'CS201',  prereqId: 'CS201',   modality: 'Hybrid',    max: 20 },
  { id: 'CS401',  dept: 'CS',   number: '401', title: 'Operating Systems',          credits: 3, prereq: 'CS301',  prereqId: 'CS301',   modality: 'In-Person', max: 22 },
  { id: 'CS450',  dept: 'CS',   number: '450', title: 'Database Systems',           credits: 3, prereq: 'CS201',  prereqId: 'CS201',   modality: 'In-Person', max: 24 },
  { id: 'CS460',  dept: 'CS',   number: '460', title: 'Computer Networks',          credits: 3, prereq: 'CS201',  prereqId: 'CS201',   modality: 'Hybrid',    max: 20 },
  { id: 'CS480',  dept: 'CS',   number: '480', title: 'Artificial Intelligence',    credits: 3, prereq: 'CS301',  prereqId: 'CS301',   modality: 'Online',    max: 25 },
  { id: 'CS499',  dept: 'CS',   number: '499', title: 'Software Engineering',       credits: 3, prereq: 'CS301',  prereqId: 'CS301',   modality: 'In-Person', max: 20 },
  // Mathematics
  { id: 'MATH101',dept: 'MATH', number: '101', title: 'Calculus I',                 credits: 4, prereq: 'None',   prereqId: null,      modality: 'In-Person', max: 35 },
  { id: 'MATH201',dept: 'MATH', number: '201', title: 'Calculus II',                credits: 4, prereq: 'MATH101',prereqId: 'MATH101', modality: 'Online',    max: 30 },
  { id: 'MATH301',dept: 'MATH', number: '301', title: 'Linear Algebra',             credits: 3, prereq: 'MATH101',prereqId: 'MATH101', modality: 'In-Person', max: 28 },
  { id: 'MATH302',dept: 'MATH', number: '302', title: 'Discrete Mathematics',       credits: 3, prereq: 'MATH101',prereqId: 'MATH101', modality: 'In-Person', max: 30 },
  { id: 'MATH401',dept: 'MATH', number: '401', title: 'Differential Equations',     credits: 3, prereq: 'MATH201',prereqId: 'MATH201', modality: 'Hybrid',    max: 22 },
  { id: 'MATH450',dept: 'MATH', number: '450', title: 'Statistics & Probability',   credits: 3, prereq: 'MATH101',prereqId: 'MATH101', modality: 'Online',    max: 35 },
  // English
  { id: 'ENG101', dept: 'ENG',  number: '101', title: 'English Composition',        credits: 3, prereq: 'None',   prereqId: null,      modality: 'In-Person', max: 25 },
  { id: 'ENG201', dept: 'ENG',  number: '201', title: 'Technical Writing',          credits: 3, prereq: 'ENG101', prereqId: 'ENG101',  modality: 'In-Person', max: 20 },
  { id: 'ENG301', dept: 'ENG',  number: '301', title: 'Literature Survey',          credits: 3, prereq: 'ENG101', prereqId: 'ENG101',  modality: 'Hybrid',    max: 22 },
  // Physics
  { id: 'PHYS101',dept: 'PHYS', number: '101', title: 'Physics I',                  credits: 4, prereq: 'None',   prereqId: null,      modality: 'In-Person', max: 30 },
  { id: 'PHYS201',dept: 'PHYS', number: '201', title: 'Physics II',                 credits: 4, prereq: 'PHYS101',prereqId: 'PHYS101', modality: 'In-Person', max: 28 },
  { id: 'PHYS301',dept: 'PHYS', number: '301', title: 'Quantum Mechanics',          credits: 3, prereq: 'PHYS201',prereqId: 'PHYS201', modality: 'Hybrid',    max: 18 },
  // Biology
  { id: 'BIO101', dept: 'BIO',  number: '101', title: 'Introduction to Biology',    credits: 4, prereq: 'None',   prereqId: null,      modality: 'In-Person', max: 32 },
  { id: 'BIO201', dept: 'BIO',  number: '201', title: 'Cell Biology',               credits: 3, prereq: 'BIO101', prereqId: 'BIO101',  modality: 'In-Person', max: 25 },
  { id: 'BIO301', dept: 'BIO',  number: '301', title: 'Genetics',                   credits: 3, prereq: 'BIO201', prereqId: 'BIO201',  modality: 'Hybrid',    max: 20 },
  // History
  { id: 'HIST101',dept: 'HIST', number: '101', title: 'World History I',            credits: 3, prereq: 'None',   prereqId: null,      modality: 'In-Person', max: 35 },
  { id: 'HIST201',dept: 'HIST', number: '201', title: 'World History II',           credits: 3, prereq: 'HIST101',prereqId: 'HIST101', modality: 'Online',    max: 30 },
  { id: 'HIST301',dept: 'HIST', number: '301', title: 'American History',           credits: 3, prereq: 'None',   prereqId: null,      modality: 'In-Person', max: 28 },
];

const SESSIONS = [
  // CS sessions
  { sessionId: 'S001', courseId: 'CS101',   instructorId: 'INST01', day: 'Monday',    time: '9:00 AM',  room: 'Room 101', modality: 'In-Person' },
  { sessionId: 'S002', courseId: 'CS101',   instructorId: 'INST09', day: 'Thursday',  time: '2:00 PM',  room: 'Room 108', modality: 'In-Person' },
  { sessionId: 'S003', courseId: 'CS201',   instructorId: 'INST01', day: 'Tuesday',   time: '11:00 AM', room: 'Room 102', modality: 'In-Person' },
  { sessionId: 'S004', courseId: 'CS301',   instructorId: 'INST03', day: 'Friday',    time: '10:00 AM', room: 'Room 103', modality: 'Hybrid'    },
  { sessionId: 'S005', courseId: 'CS401',   instructorId: 'INST04', day: 'Monday',    time: '2:00 PM',  room: 'Room 104', modality: 'In-Person' },
  { sessionId: 'S006', courseId: 'CS450',   instructorId: 'INST09', day: 'Tuesday',   time: '9:00 AM',  room: 'Room 105', modality: 'In-Person' },
  { sessionId: 'S007', courseId: 'CS460',   instructorId: 'INST03', day: 'Wednesday', time: '11:00 AM', room: 'Room 106', modality: 'Hybrid'    },
  { sessionId: 'S008', courseId: 'CS480',   instructorId: 'INST04', day: 'Thursday',  time: '1:00 PM',  room: 'Online',   modality: 'Online'    },
  { sessionId: 'S009', courseId: 'CS499',   instructorId: 'INST09', day: 'Friday',    time: '2:00 PM',  room: 'Room 107', modality: 'In-Person' },
  // MATH sessions
  { sessionId: 'S010', courseId: 'MATH101', instructorId: 'INST02', day: 'Wednesday', time: '1:00 PM',  room: 'Room 201', modality: 'In-Person' },
  { sessionId: 'S011', courseId: 'MATH101', instructorId: 'INST05', day: 'Monday',    time: '10:00 AM', room: 'Room 206', modality: 'In-Person' },
  { sessionId: 'S012', courseId: 'MATH201', instructorId: 'INST02', day: 'Thursday',  time: '3:00 PM',  room: 'Online',   modality: 'Online'    },
  { sessionId: 'S013', courseId: 'MATH301', instructorId: 'INST05', day: 'Tuesday',   time: '1:00 PM',  room: 'Room 203', modality: 'In-Person' },
  { sessionId: 'S014', courseId: 'MATH302', instructorId: 'INST10', day: 'Wednesday', time: '9:00 AM',  room: 'Room 204', modality: 'In-Person' },
  { sessionId: 'S015', courseId: 'MATH401', instructorId: 'INST05', day: 'Thursday',  time: '11:00 AM', room: 'Room 205', modality: 'Hybrid'    },
  { sessionId: 'S016', courseId: 'MATH450', instructorId: 'INST10', day: 'Friday',    time: '9:00 AM',  room: 'Online',   modality: 'Online'    },
  // ENG sessions
  { sessionId: 'S017', courseId: 'ENG101',  instructorId: 'INST06', day: 'Monday',    time: '11:00 AM', room: 'Room 301', modality: 'In-Person' },
  { sessionId: 'S018', courseId: 'ENG101',  instructorId: 'INST12', day: 'Wednesday', time: '2:00 PM',  room: 'Room 305', modality: 'In-Person' },
  { sessionId: 'S019', courseId: 'ENG201',  instructorId: 'INST06', day: 'Wednesday', time: '9:00 AM',  room: 'Room 302', modality: 'In-Person' },
  { sessionId: 'S020', courseId: 'ENG301',  instructorId: 'INST12', day: 'Friday',    time: '1:00 PM',  room: 'Room 303', modality: 'Hybrid'    },
  // PHYS sessions
  { sessionId: 'S021', courseId: 'PHYS101', instructorId: 'INST07', day: 'Tuesday',   time: '10:00 AM', room: 'Room 401', modality: 'In-Person' },
  { sessionId: 'S022', courseId: 'PHYS201', instructorId: 'INST07', day: 'Thursday',  time: '10:00 AM', room: 'Room 402', modality: 'In-Person' },
  { sessionId: 'S023', courseId: 'PHYS301', instructorId: 'INST11', day: 'Friday',    time: '3:00 PM',  room: 'Room 403', modality: 'Hybrid'    },
  // BIO sessions
  { sessionId: 'S024', courseId: 'BIO101',  instructorId: 'INST08', day: 'Monday',    time: '1:00 PM',  room: 'Room 501', modality: 'In-Person' },
  { sessionId: 'S025', courseId: 'BIO201',  instructorId: 'INST08', day: 'Wednesday', time: '3:00 PM',  room: 'Room 502', modality: 'In-Person' },
  { sessionId: 'S026', courseId: 'BIO301',  instructorId: 'INST11', day: 'Friday',    time: '11:00 AM', room: 'Room 503', modality: 'Hybrid'    },
  // HIST sessions
  { sessionId: 'S027', courseId: 'HIST101', instructorId: 'INST12', day: 'Tuesday',   time: '2:00 PM',  room: 'Room 601', modality: 'In-Person' },
  { sessionId: 'S028', courseId: 'HIST201', instructorId: 'INST06', day: 'Thursday',  time: '9:00 AM',  room: 'Online',   modality: 'Online'    },
  { sessionId: 'S029', courseId: 'HIST301', instructorId: 'INST12', day: 'Monday',    time: '3:00 PM',  room: 'Room 602', modality: 'In-Person' },
];

const students    = STUDENTS.slice();
const instructors = INSTRUCTORS.slice();
const courses     = COURSES.slice();
const sessions    = SESSIONS.slice();
let   enrollments = {
  // Pre-populated enrollments for testing schedule conflict
  // Student STU101 (Joe Smith) is enrolled in:
  'S001': ['STU101'], // CS101 - Monday 9:00 AM
  'S017': ['STU101'], // ENG101 - Monday 11:00 AM
  'S012': ['STU101'], // MATH201 - Thursday 3:00 PM
};

function loadEnrollmentsFromStorage() {
  try {
    const raw = localStorage.getItem('enrollments');
    enrollments = raw ? JSON.parse(raw) : {};
  } catch (e) {
    enrollments = {};
  }
}

function saveEnrollmentsToStorage() {
  localStorage.setItem('enrollments', JSON.stringify(enrollments));
}


/***********************************************************************
  2) Utility Helpers
************************************************************************/

function $(id) { return document.getElementById(id); }

function courseById(courseId)         { return courses.find(c => c.id === courseId); }
function instructorById(instructorId) { return instructors.find(i => i.id === instructorId); }
function studentById(studentId)       { return students.find(s => s.studentId === studentId); }

function renderTableRows(tbody, rowsHtml) { tbody.innerHTML = rowsHtml; }

function modalityBadge(modality) {
  const map = { 'In-Person': 'badge-green', 'Hybrid': 'badge-blue', 'Online': 'badge-gold' };
  return `<span class="badge ${map[modality] || 'badge-gold'}">${modality}</span>`;
}

function capBar(current, max) {
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  const cls = pct >= 90 ? 'danger' : pct >= 70 ? 'warn' : '';
  return `
    <div style="white-space:nowrap;">
      <span class="cap-bar"><span class="cap-bar-fill ${cls}" style="width:${pct}%"></span></span>
      <small>${current} / ${max}</small>
    </div>`;
}

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast alert alert-${type}`;
  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    min-width:280px; max-width:420px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    animation: slideIn 0.25s ease;
  `;
  toast.innerHTML = `
    <style>@keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:none;opacity:1}}</style>
    ${message}
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


/***********************************************************************
  3) Student Session Management
************************************************************************/

function getLoggedInStudent() {
  const data = sessionStorage.getItem('studentSession');
  if (!data) return null;
  try { return JSON.parse(data); } catch (e) { return null; }
}

function setStudentSession(student) {
  sessionStorage.setItem('studentSession', JSON.stringify({
    studentId:        student.studentId,
    username:         student.username,
    firstName:        student.firstName,
    lastName:         student.lastName,
    completedCourses: student.completedCourses,
  }));
}

function clearStudentSession() {
  sessionStorage.removeItem('studentSession');
}

function requireStudentLogin() {
  if (!getLoggedInStudent()) window.location.href = 'student-login.html';
}

function redirectIfLoggedIn() {
  if (getLoggedInStudent()) window.location.href = 'index.html';
}


/***********************************************************************
  4) Navbar
************************************************************************/

function renderNavUser() {
  const student = getLoggedInStudent();
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const existing = document.getElementById('navUserWidget');
  if (existing) existing.remove();

  const widget = document.createElement('div');
  widget.id = 'navUserWidget';
  widget.className = 'nav-user';

  if (student) {
    widget.innerHTML = `
      <span class="nav-user-name">👤 ${student.firstName} ${student.lastName}</span>
      <button class="btn-nav-logout" id="btnNavLogout">Log Out</button>
    `;
    nav.appendChild(widget);
    document.getElementById('btnNavLogout').addEventListener('click', () => {
      clearStudentSession();
      window.location.href = 'student-login.html';
    });
  } else {
    widget.innerHTML = `<a href="student-login.html" class="btn-nav-login">Student Login</a>`;
    nav.appendChild(widget);
  }
}


/***********************************************************************
  5) Mobile Hamburger Menu
************************************************************************/

function initHamburger() {
  const btn = $('hamburgerBtn');
  const nav = $('mainNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', false);
    });
  });
}


/***********************************************************************
  6) Student Login
************************************************************************/

function fillDemo(username, password) {
  const u = $('loginUsername');
  const p = $('loginPassword');
  if (u) u.value = username;
  if (p) p.value = password;
  if (u) u.focus();
}

function handleStudentLogin() {
  const username = $('loginUsername')?.value?.trim();
  const password = $('loginPassword')?.value?.trim();

  if (!username || !password) {
    showLoginError('Please enter your username and password.');
    return;
  }

  const student = students.find(
    s => s.username.toLowerCase() === username.toLowerCase() && s.password === password
  );

  if (!student) {
    showLoginError('Incorrect username or password. Please try again.');
    if ($('loginPassword')) {
      $('loginPassword').value = '';
      $('loginPassword').focus();
    }
    return;
  }

  setStudentSession(student);
  window.location.href = 'index.html';
}

function showLoginError(msg) {
  const el = $('loginError');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}


/***********************************************************************
  7) Registration
************************************************************************/

const CREDIT_LIMIT = 18;

function getEnrolledCredits(studentId) {
  return Object.entries(enrollments)
    .filter(([, studs]) => studs.includes(studentId))
    .reduce((total, [sessionId]) => {
      const s = sessions.find(sess => sess.sessionId === sessionId);
      const c = s ? courseById(s.courseId) : null;
      return total + (c ? c.credits : 0);
    }, 0);
}

function hasScheduleConflict(studentId, newSession) {
  // Get all sessions the student is currently enrolled in
  const enrolledSessionIds = Object.entries(enrollments)
    .filter(([, studs]) => studs.includes(studentId))
    .map(([sessionId]) => sessionId);

  for (const enrolledSessionId of enrolledSessionIds) {
    const enrolledSession = sessions.find(s => s.sessionId === enrolledSessionId);
    if (!enrolledSession) continue;

    // Check if same day and time
    if (enrolledSession.day === newSession.day && enrolledSession.time === newSession.time) {
      const enrolledCourse = courseById(enrolledSession.courseId);
      return {
        conflict: true,
        conflictingSession: enrolledSession,
        conflictingCourse: enrolledCourse
      };
    }
  }
  return { conflict: false };
}

function registerStudentForSession(studentId, sessionId) {
  const session = sessions.find(s => s.sessionId === sessionId);
  if (!session) return { ok: false, msg: 'Session not found.' };

  const course = courseById(session.courseId);
  if (!course) return { ok: false, msg: 'Course not found.' };

  const student = studentById(studentId);
  if (!student) return { ok: false, msg: 'Student not found.' };

  if ((enrollments[sessionId] || []).includes(studentId))
    return { ok: false, msg: 'You are already enrolled in this session.' };

  // Check for schedule conflict
  const conflictCheck = hasScheduleConflict(studentId, session);
  if (conflictCheck.conflict) {
    const conflictInfo = conflictCheck.conflictingCourse 
      ? `${conflictCheck.conflictingCourse.id} - ${conflictCheck.conflictingCourse.title}`
      : conflictCheck.conflictingSession?.sessionId;
    return { 
      ok: false, 
      msg: `Schedule conflict! You are already enrolled in ${conflictInfo} on ${session.day} at ${session.time}.` 
    };
  }

  const currentCount = (enrollments[sessionId] || []).length;
  if (currentCount >= course.max)
    return { ok: false, msg: `This session is full (${course.max}/${course.max} seats taken).` };

  if (course.prereqId && !student.completedCourses.includes(course.prereqId))
    return { ok: false, msg: `Missing prerequisite: ${course.prereq} must be completed before enrolling in ${course.id}.` };

  const enrolledCredits = getEnrolledCredits(studentId);
  if (enrolledCredits + course.credits > CREDIT_LIMIT)
    return { ok: false, msg: `Credit limit reached. Adding ${course.credits} credits would exceed the ${CREDIT_LIMIT}-credit semester limit (currently at ${enrolledCredits}).` };

  if (!enrollments[sessionId]) enrollments[sessionId] = [];
  enrollments[sessionId].push(studentId);
  saveEnrollmentsToStorage();

  return { ok: true, msg: `Enrolled successfully in ${course.id} — ${course.title}` };
}


/***********************************************************************
  8) Drop Course
************************************************************************/

function dropStudentFromSession(studentId, sessionId) {
  if (!(enrollments[sessionId] || []).includes(studentId))
    return { ok: false, msg: 'You are not enrolled in this session.' };

  enrollments[sessionId] = enrollments[sessionId].filter(id => id !== studentId);
  saveEnrollmentsToStorage();

  return { ok: true, msg: 'Course dropped successfully.' };
}


/***********************************************************************
  9) Course Search Page
************************************************************************/

function searchCourses() {
  const query = $('courseInput')?.value?.trim()?.toLowerCase() || '';
  const dept  = $('deptFilter')?.value?.trim()?.toUpperCase() || '';
  const num   = $('courseNumberFilter')?.value?.trim() || '';
  const instr = $('instructorFilter')?.value?.trim()?.toUpperCase() || '';

  const matches = courses.filter(c => {
    const deptOk  = !dept  || c.dept === dept;
    const numOk   = !num   || c.number === num;
    const queryOk = !query || c.id.toLowerCase().includes(query) || c.title.toLowerCase().includes(query);
    const instrOk = !instr || sessions.some(s => s.courseId === c.id && s.instructorId === instr);
    return deptOk && numOk && queryOk && instrOk;
  });

  const resultsEl = $('courseResults');
  const noResults = $('noResultsMessage');
  if (!resultsEl) return;

  if (matches.length === 0) {
    resultsEl.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }

  if (noResults) noResults.style.display = 'none';

  resultsEl.innerHTML = `
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Credits</th>
            <th>Professor</th>
            <th>Prerequisite</th>
            <th>Modality</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          ${matches.map(c => {
            const sess  = sessions.find(s => s.courseId === c.id);
            const prof  = sess ? (instructorById(sess.instructorId)?.name || 'TBA') : 'TBA';
            return `
              <tr>
                <td><strong>${c.id}</strong><br><small style="color:var(--muted)">${c.title}</small></td>
                <td>${c.credits}</td>
                <td>${prof}</td>
                <td>${c.prereq || 'None'}</td>
                <td>${modalityBadge(c.modality)}</td>
                <td>${c.max}</td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

function filterCourses() { searchCourses(); }


/***********************************************************************
  10) Registration Page
************************************************************************/

function updateCreditTracker(studentId) {
  const used      = getEnrolledCredits(studentId);
  const remaining = CREDIT_LIMIT - used;
  const pct       = Math.min(100, Math.round((used / CREDIT_LIMIT) * 100));
  const tracker   = $('creditTracker');
  if (!tracker) return;
  tracker.style.display = 'flex';
  $('creditUsed').textContent      = used;
  $('creditRemaining').textContent = remaining;
  const bar = $('creditBar');
  bar.style.width      = pct + '%';
  bar.style.background = pct >= 100 ? '#e74c3c' : pct >= 80 ? '#f39c12' : '#ffb300';
}

function loadRegistrationDisplay() {
  const dept  = $('regDeptFilter')?.value || 'All';
  const num   = $('regNumFilter')?.value?.trim() || '';
  const tbody = $('registrationTableBody');
  if (!tbody) return;

  const student = getLoggedInStudent();
  if (!student) return;

  updateCreditTracker(student.studentId);

  const available = sessions.filter(s => {
    const c = courseById(s.courseId);
    if (!c) return false;
    return (dept === 'All' || c.dept === dept) && (!num || c.number === num);
  });

  if (available.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--muted);">No sessions match your filters.</td></tr>`;
    return;
  }

  const html = available.map(s => {
    const c            = courseById(s.courseId);
    const profName     = instructorById(s.instructorId)?.name || 'TBA';
    const currentCount = (enrollments[s.sessionId] || []).length;
    const isFull       = currentCount >= c.max;
    const isEnrolled   = (enrollments[s.sessionId] || []).includes(student.studentId);

    const dot = isFull
      ? `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e74c3c;margin-right:5px;" title="Full"></span>`
      : `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#27ae60;margin-right:5px;" title="Open"></span>`;

    const btn = isEnrolled
      ? `<span class="badge badge-green">✓ Enrolled</span>`
      : isFull
        ? `<button class="btn btn-secondary" disabled>Full</button>`
        : `<button class="btn btn-primary" onclick="executeRegistration('${s.sessionId}')">Register</button>`;

    return `
      <tr>
        <td><strong>${c.dept} ${c.number}</strong><br><small style="color:var(--muted)">${c.title}</small></td>
        <td>${s.sessionId}</td>
        <td>${profName}</td>
        <td>${s.day} ${s.time}<br><small style="color:var(--muted)">${s.room}</small></td>
        <td>${c.prereq || 'None'}</td>
        <td>${dot}${capBar(currentCount, c.max)}</td>
        <td>${btn}</td>
      </tr>`;
  }).join('');

  renderTableRows(tbody, html);
}

function executeRegistration(sessId) {
  const student = getLoggedInStudent();
  if (!student) { window.location.href = 'student-login.html'; return; }

  const result = registerStudentForSession(student.studentId, sessId);
  showToast(result.msg, result.ok ? 'success' : 'error');
  loadRegistrationDisplay();
}


/***********************************************************************
  11) Enrollment Page
************************************************************************/

function loadEnrollmentPage() {
  const tbody = $('enrollmentTableBody');
  if (!tbody) return;

  const student = getLoggedInStudent();
  if (!student) return;

  const subtitle = document.querySelector('.page-subtitle');
  if (subtitle) {
    subtitle.innerHTML = `Viewing schedule for <strong>${student.firstName} ${student.lastName}</strong> (${student.username}) — Spring 2026`;
  }

  const mySessionIds = Object.entries(enrollments)
    .filter(([, studs]) => studs.includes(student.studentId))
    .map(([sessionId]) => sessionId);

  const emptyEl   = $('enrollmentEmpty');
  const summaryEl = $('enrollmentSummary');

  if (mySessionIds.length === 0) {
    tbody.innerHTML = '';
    if (emptyEl)   emptyEl.style.display   = 'block';
    if (summaryEl) summaryEl.style.display = 'none';
    // Clear calendar when no enrollments
    renderCalendar([]);
    return;
  }

  if (emptyEl)   emptyEl.style.display   = 'none';
  if (summaryEl) summaryEl.style.display = 'flex';

  let totalCredits = 0;

  const rows = mySessionIds.map(sessionId => {
    const s = sessions.find(sess => sess.sessionId === sessionId);
    if (!s) return '';
    const c     = courseById(s.courseId);
    const instr = instructorById(s.instructorId);
    totalCredits += c.credits;
    return `
      <tr>
        <td><strong>${c.id}</strong><br><small style="color:var(--muted)">${c.title}</small></td>
        <td>${s.sessionId}</td>
        <td>${instr ? instr.name : 'TBA'}</td>
        <td>${s.day} ${s.time}</td>
        <td>${s.room}</td>
        <td>${c.credits}</td>
        <td><button class="btn btn-danger" onclick="executeDrop('${s.sessionId}')">Drop</button></td>
      </tr>`;
  }).join('');

  renderTableRows(tbody, rows);

  if ($('totalCourses')) $('totalCourses').textContent = mySessionIds.length;
  if ($('totalCredits')) $('totalCredits').textContent = totalCredits;

  // Render calendar view
  const enrolledSessions = mySessionIds
    .map(sessionId => sessions.find(s => s.sessionId === sessionId))
    .filter(s => s);
  renderCalendar(enrolledSessions);
}

function renderCalendar(enrolledSessions) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  days.forEach(day => {
    const dayEl = $(`calendar-${day}`);
    if (!dayEl) return;
    
    const daySessions = enrolledSessions.filter(s => s.day === day);
    
    if (daySessions.length === 0) {
      dayEl.innerHTML = '<div class="calendar-empty">No classes</div>';
      return;
    }
    
    // Sort by time
    daySessions.sort((a, b) => a.time.localeCompare(b.time));
    
    dayEl.innerHTML = daySessions.map(s => {
      const c = courseById(s.courseId);
      return `
        <div class="calendar-event">
          <div class="event-time">${s.time}</div>
          <div class="event-course">${c.id}</div>
          <div class="event-title">${c.title}</div>
          <div class="event-room">${s.room}</div>
        </div>
      `;
    }).join('');
  });
}

function executeDrop(sessId) {
  const student = getLoggedInStudent();
  if (!student) return;

  const result = dropStudentFromSession(student.studentId, sessId);
  showToast(result.msg, result.ok ? 'success' : 'error');
  loadEnrollmentPage();
}


/***********************************************************************
  12) Instructor Login & Schedule
************************************************************************/

function instructorLogin() {
  const id  = $('instructorId')?.value?.trim();
  const pwd = $('instructorPassword')?.value?.trim();

  if (!id || !pwd) {
    if ($('instructorLoginMsg')) $('instructorLoginMsg').textContent = 'Please enter both ID and password.';
    return;
  }

  const exists = instructors.some(i => i.id === id);
  if (!exists) {
    if ($('instructorLoginMsg')) $('instructorLoginMsg').textContent = 'Instructor ID not found.';
    return;
  }

  localStorage.setItem('instructorId', id);
  if ($('instructorLoginMsg')) $('instructorLoginMsg').textContent = '';
  loadInstructorSchedule();
}

function instructorLogout() {
  localStorage.removeItem('instructorId');
  if ($('scheduleCard'))        $('scheduleCard').hidden        = true;
  if ($('btnInstructorLogout')) $('btnInstructorLogout').hidden = true;
  const loginSection = $('instructorLoginSection');
  if (loginSection) loginSection.hidden = false;
  if ($('instructorLoginMsg')) $('instructorLoginMsg').textContent = 'Logged out.';
}

function loadInstructorSchedule() {
  const id = localStorage.getItem('instructorId');
  if (!id) return;

  const instr = instructorById(id);
  const assigned = sessions.filter(s => s.instructorId === id);

  if ($('scheduleCard'))        $('scheduleCard').hidden        = false;
  if ($('btnInstructorLogout')) $('btnInstructorLogout').hidden = false;
  const loginSection = $('instructorLoginSection');
  if (loginSection) loginSection.hidden = true;

  if ($('instructorName')) $('instructorName').textContent = instr ? instr.name : id;

  const tbody = $('instructorScheduleBody');
  if (!tbody) return;

  if (assigned.length === 0) {
    if ($('scheduleEmptyMsg')) $('scheduleEmptyMsg').hidden = false;
    renderTableRows(tbody, '');
    return;
  }

  if ($('scheduleEmptyMsg')) $('scheduleEmptyMsg').hidden = true;

  const html = assigned.map(s => {
    const c = courseById(s.courseId);
    const enrolledCount = (enrollments[s.sessionId] || []).length;
    return `
      <tr>
        <td><strong>${c.id}</strong> — ${c.title}</td>
        <td>${s.sessionId}</td>
        <td>${s.day}</td>
        <td>${s.time}</td>
        <td>${s.room}</td>
        <td>${modalityBadge(s.modality)}</td>
        <td>${enrolledCount} / ${c.max}</td>
      </tr>`;
  }).join('');

  renderTableRows(tbody, html);
}


/***********************************************************************
  13) Page Initialization
************************************************************************/

document.addEventListener('DOMContentLoaded', () => {
  loadEnrollmentsFromStorage();
  initHamburger();
  renderNavUser();

  if ($('btnStudentLogin')) {
    redirectIfLoggedIn();
    $('btnStudentLogin').addEventListener('click', handleStudentLogin);
    [$('loginUsername'), $('loginPassword')].forEach(el => {
      if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') handleStudentLogin(); });
    });
  }

  if (['registrationTableBody', 'enrollmentTableBody'].some(id => $(id))) requireStudentLogin();

  if ($('btnInstructorLogin'))  $('btnInstructorLogin').addEventListener('click', instructorLogin);
  if ($('btnInstructorLogout')) $('btnInstructorLogout').addEventListener('click', instructorLogout);
  if ($('instructorScheduleBody')) loadInstructorSchedule();

  if ($('courseResults')) {
    const btn = $('searchBtn');
    if (btn) btn.addEventListener('click', searchCourses);
    ['deptFilter', 'instructorFilter', 'courseNumberFilter'].forEach(id => {
      if ($(id)) $(id).addEventListener('input', searchCourses);
    });
    if ($('courseInput')) {
      $('courseInput').addEventListener('input', searchCourses);
      $('courseInput').addEventListener('keydown', e => { if (e.key === 'Enter') searchCourses(); });
    }
    searchCourses();
  }

  if ($('registrationTableBody')) {
    if ($('btnSearchReg'))  $('btnSearchReg').addEventListener('click', loadRegistrationDisplay);
    if ($('regDeptFilter')) $('regDeptFilter').addEventListener('change', loadRegistrationDisplay);
    if ($('regNumFilter'))  $('regNumFilter').addEventListener('input', loadRegistrationDisplay);
    loadRegistrationDisplay();
  }

  if ($('enrollmentTableBody')) loadEnrollmentPage();
});
