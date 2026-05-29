export const quizData = {

  // ════════════════════════════════════════════════════════════
  // GATE CS/IT
  // ════════════════════════════════════════════════════════════

  "Data Structures": [
    { q: "What is the time complexity of searching in a balanced BST?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: "O(log n)" },
    { q: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Deque", "Heap"], correct: "Stack" },
    { q: "In a max-heap of n elements, where is the minimum element?", options: ["Root", "Last level leaf", "Second level", "Cannot be determined"], correct: "Cannot be determined" },
    { q: "What is the worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correct: "O(n²)" },
    { q: "Which traversal of BST gives sorted output?", options: ["Preorder", "Postorder", "Inorder", "Level order"], correct: "Inorder" },
    { q: "A full binary tree with n leaves has how many internal nodes?", options: ["n", "n-1", "n+1", "2n-1"], correct: "n-1" },
    { q: "What is the height of an AVL tree with n nodes?", options: ["O(n)", "O(log n)", "O(n²)", "O(√n)"], correct: "O(log n)" },
    { q: "Which sorting algorithm is stable and has O(n log n) worst case?", options: ["QuickSort", "HeapSort", "MergeSort", "SelectionSort"], correct: "MergeSort" },
  ],

  "Algorithms & DAA": [
    { q: "What is the recurrence for merge sort? T(n) = 2T(n/2) + n. What is T(n)?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correct: "O(n log n)" },
    { q: "Dijkstra's algorithm fails on graphs with:", options: ["Positive weights", "Negative weights", "Zero weights", "Undirected edges"], correct: "Negative weights" },
    { q: "Which algorithm finds MST using a greedy approach starting from a vertex?", options: ["Kruskal", "Prim", "Dijkstra", "Bellman-Ford"], correct: "Prim" },
    { q: "The 0/1 Knapsack problem is solved using:", options: ["Greedy", "Dynamic Programming", "Divide & Conquer", "Backtracking"], correct: "Dynamic Programming" },
    { q: "What is the time complexity of Floyd-Warshall algorithm?", options: ["O(n²)", "O(n³)", "O(n log n)", "O(n² log n)"], correct: "O(n³)" },
    { q: "Which class of problems can be solved in polynomial time?", options: ["NP", "NP-Hard", "P", "NP-Complete"], correct: "P" },
    { q: "Fractional Knapsack can be solved optimally using:", options: ["DP", "Greedy", "Backtracking", "Branch & Bound"], correct: "Greedy" },
    { q: "What does amortized analysis compute?", options: ["Worst case per operation", "Average time per operation over a sequence", "Best case", "Space complexity"], correct: "Average time per operation over a sequence" },
  ],

  "Operating Systems": [
    { q: "Which page replacement algorithm suffers from Belady's anomaly?", options: ["LRU", "Optimal", "FIFO", "Clock"], correct: "FIFO" },
    { q: "A process in deadlock is waiting for a resource held by:", options: ["CPU", "Another waiting process", "I/O device", "OS kernel"], correct: "Another waiting process" },
    { q: "Which scheduling algorithm gives minimum average waiting time for a given set of processes?", options: ["FCFS", "Round Robin", "SJF", "Priority"], correct: "SJF" },
    { q: "Thrashing occurs when:", options: ["CPU utilization is 100%", "Too many page faults occur due to insufficient frames", "Deadlock occurs", "Memory is full"], correct: "Too many page faults occur due to insufficient frames" },
    { q: "Which of the following is NOT a condition for deadlock?", options: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"], correct: "Preemption" },
    { q: "The critical section problem requires:", options: ["Mutual Exclusion, Progress, Bounded Waiting", "Only Mutual Exclusion", "Semaphores only", "Monitors only"], correct: "Mutual Exclusion, Progress, Bounded Waiting" },
    { q: "In demand paging, a page fault occurs when:", options: ["Page is in memory", "Page is not in memory", "TLB hit occurs", "Page table is full"], correct: "Page is not in memory" },
    { q: "Which is NOT a valid process state?", options: ["Ready", "Running", "Blocked", "Compiling"], correct: "Compiling" },
  ],

  "Computer Networks": [
    { q: "Which layer of OSI model handles routing?", options: ["Data Link", "Transport", "Network", "Session"], correct: "Network" },
    { q: "TCP uses which type of connection?", options: ["Connectionless", "Connection-oriented", "Broadcast", "Multicast"], correct: "Connection-oriented" },
    { q: "What is the subnet mask for a /26 network?", options: ["255.255.255.0", "255.255.255.128", "255.255.255.192", "255.255.255.224"], correct: "255.255.255.192" },
    { q: "Which protocol is used to convert IP address to MAC address?", options: ["DNS", "RARP", "ARP", "ICMP"], correct: "ARP" },
    { q: "Which protocol provides reliable, ordered delivery?", options: ["UDP", "IP", "TCP", "ICMP"], correct: "TCP" },
    { q: "HTTP works on which port by default?", options: ["21", "23", "80", "443"], correct: "80" },
    { q: "Which algorithm is used in distance vector routing?", options: ["Dijkstra", "Bellman-Ford", "Floyd-Warshall", "BFS"], correct: "Bellman-Ford" },
    { q: "What does CSMA/CD stand for?", options: ["Carrier Sense Multiple Access / Collision Detection", "Channel Switching Multiple Access", "Carrier Signal Multiple Access", "None"], correct: "Carrier Sense Multiple Access / Collision Detection" },
  ],

  "DBMS": [
    { q: "Which normal form removes transitive dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correct: "3NF" },
    { q: "ACID properties stand for:", options: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Integrity, Data", "Atomicity, Concurrency, Integrity, Durability", "None"], correct: "Atomicity, Consistency, Isolation, Durability" },
    { q: "Which JOIN returns all rows from both tables including unmatched?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correct: "FULL OUTER JOIN" },
    { q: "What is a lossless join decomposition?", options: ["No data is lost when tables are split and rejoined", "Tables cannot be joined", "Primary key is lost", "Foreign key is removed"], correct: "No data is lost when tables are split and rejoined" },
    { q: "Which of the following is NOT a DDL command?", options: ["CREATE", "ALTER", "DROP", "SELECT"], correct: "SELECT" },
    { q: "In 2PL, once a lock is released:", options: ["New locks can be acquired", "No new locks can be acquired", "All locks are released", "Transaction rolls back"], correct: "No new locks can be acquired" },
    { q: "Which is the highest level of normal form that removes all anomalies?", options: ["3NF", "BCNF", "4NF", "5NF"], correct: "5NF" },
    { q: "B+ tree index stores data in:", options: ["Root nodes", "Internal nodes", "Leaf nodes", "All nodes"], correct: "Leaf nodes" },
  ],

  "Computer Organization": [
    { q: "In 2's complement, -5 in 8-bit is:", options: ["11111010", "11111011", "10000101", "01111011"], correct: "11111011" },
    { q: "Which addressing mode uses the operand directly in the instruction?", options: ["Direct", "Indirect", "Immediate", "Register"], correct: "Immediate" },
    { q: "Cache memory is based on which principle?", options: ["Spatial locality only", "Temporal locality only", "Both spatial and temporal locality", "Random access"], correct: "Both spatial and temporal locality" },
    { q: "What is the CPI if a processor executes 10⁶ instructions in 2s at 10⁶ Hz clock?", options: ["0.5", "1", "2", "5"], correct: "2" },
    { q: "Which pipeline hazard is caused by data dependency?", options: ["Structural hazard", "Data hazard", "Control hazard", "Memory hazard"], correct: "Data hazard" },
    { q: "DMA stands for:", options: ["Direct Memory Access", "Dynamic Memory Allocation", "Data Memory Address", "Direct Module Access"], correct: "Direct Memory Access" },
    { q: "IEEE 754 single precision uses how many bits for mantissa?", options: ["8", "16", "23", "32"], correct: "23" },
    { q: "Which flip-flop avoids the race condition in SR flip-flop?", options: ["D flip-flop", "T flip-flop", "JK flip-flop", "Master-slave flip-flop"], correct: "JK flip-flop" },
  ],

  "Theory of Computation": [
    { q: "Which grammar type generates context-free languages?", options: ["Type 0", "Type 1", "Type 2", "Type 3"], correct: "Type 2" },
    { q: "The language {aⁿbⁿ | n≥0} is:", options: ["Regular", "Context-Free but not Regular", "Context-Sensitive", "Recursive"], correct: "Context-Free but not Regular" },
    { q: "Which of the following is undecidable?", options: ["Membership in CFL", "Emptiness of DFA", "Halting problem", "Equivalence of DFAs"], correct: "Halting problem" },
    { q: "Minimum states DFA accepts strings ending in '01':", options: ["2", "3", "4", "5"], correct: "3" },
    { q: "PDA differs from FA by having:", options: ["Multiple tapes", "A stack", "Non-determinism", "Multiple heads"], correct: "A stack" },
    { q: "Which is NOT a regular language?", options: ["All strings over {a,b}", "Strings with even a's", "aⁿbⁿ", "Strings ending in ab"], correct: "aⁿbⁿ" },
    { q: "Rice's theorem states:", options: ["All properties of TM are decidable", "All non-trivial semantic properties of TM are undecidable", "CFL is closed under complement", "NFA = DFA"], correct: "All non-trivial semantic properties of TM are undecidable" },
    { q: "ε-NFA can be converted to:", options: ["Only NFA", "Only DFA", "Equivalent DFA", "PDA"], correct: "Equivalent DFA" },
  ],

  "Digital Logic": [
    { q: "What is the minimal SOP of F = Σ(0,1,2,5,7)?", options: ["A'B' + AC + B'C", "A'B + AC' + BC", "AB + BC + A'C'", "A'C' + BC + AB'"], correct: "A'B' + AC + B'C" },
    { q: "A half adder has how many outputs?", options: ["1", "2", "3", "4"], correct: "2" },
    { q: "Which gate is called the universal gate?", options: ["AND", "OR", "NAND", "XOR"], correct: "NAND" },
    { q: "In a 4-bit ripple carry adder, maximum carry propagation delay is:", options: ["1 gate delay", "2 gate delays", "4 gate delays", "8 gate delays"], correct: "8 gate delays" },
    { q: "XOR gate output is 1 when:", options: ["Both inputs are 1", "Both inputs are 0", "Inputs are different", "Any input is 1"], correct: "Inputs are different" },
    { q: "How many 2-to-1 MUXes are needed to build a 4-to-1 MUX?", options: ["2", "3", "4", "6"], correct: "3" },
    { q: "A D flip-flop stores:", options: ["2 bits", "The complement of input", "The input value at clock edge", "XOR of inputs"], correct: "The input value at clock edge" },
    { q: "Gray code for decimal 6 is:", options: ["0110", "0101", "1001", "0111"], correct: "0101" },
  ],

  // ════════════════════════════════════════════════════════════
  // GATE ECE
  // ════════════════════════════════════════════════════════════

  "Signals and Systems": [
    { q: "A system is LTI if it satisfies:", options: ["Linearity only", "Time-invariance only", "Both linearity and time-invariance", "Causality"], correct: "Both linearity and time-invariance" },
    { q: "Fourier transform of δ(t) is:", options: ["0", "1", "jω", "1/jω"], correct: "1" },
    { q: "Convolution in time domain corresponds to what in frequency domain?", options: ["Addition", "Subtraction", "Multiplication", "Division"], correct: "Multiplication" },
    { q: "A causal system has impulse response:", options: ["h(t) ≠ 0 for t < 0", "h(t) = 0 for t < 0", "h(t) = 0 for all t", "h(t) = 1 for all t"], correct: "h(t) = 0 for t < 0" },
    { q: "Z-transform of u[n] is:", options: ["z/(z-1), |z|>1", "1/(z-1)", "z-1/z", "1/z"], correct: "z/(z-1), |z|>1" },
  ],

  "Electronic Devices": [
    { q: "In a p-n junction under forward bias, the depletion region:", options: ["Widens", "Narrows", "Stays same", "Disappears completely"], correct: "Narrows" },
    { q: "The Early effect in BJT refers to:", options: ["Base width modulation", "Emitter injection", "Collector saturation", "Leakage current"], correct: "Base width modulation" },
    { q: "Pinch-off voltage in JFET is the voltage at which:", options: ["Device turns on", "Channel is fully open", "Channel is completely depleted", "Gate breaks down"], correct: "Channel is completely depleted" },
    { q: "Zener diode is used primarily for:", options: ["Amplification", "Rectification", "Voltage regulation", "Switching"], correct: "Voltage regulation" },
    { q: "MOSFET in saturation region has drain current proportional to:", options: ["VDS", "(VGS - Vth)", "(VGS - Vth)²", "VGS²"], correct: "(VGS - Vth)²" },
  ],

  "Control Systems": [
    { q: "A system with gain margin < 0 dB is:", options: ["Stable", "Marginally stable", "Unstable", "Critically damped"], correct: "Unstable" },
    { q: "The steady-state error for ramp input in Type-1 system is:", options: ["0", "Finite constant", "Infinite", "1"], correct: "Finite constant" },
    { q: "Routh-Hurwitz criterion determines:", options: ["Frequency response", "Stability without finding roots", "Transient response", "Gain margin"], correct: "Stability without finding roots" },
    { q: "PID controller adds which of the following to reduce steady-state error?", options: ["Derivative", "Proportional", "Integral", "Lead"], correct: "Integral" },
    { q: "Bode plot of a pure integrator (1/s) has slope:", options: ["+20 dB/decade", "-20 dB/decade", "+40 dB/decade", "-40 dB/decade"], correct: "-20 dB/decade" },
  ],

  // ════════════════════════════════════════════════════════════
  // GATE CIVIL
  // ════════════════════════════════════════════════════════════

  "Structural Engineering": [
    { q: "The point of contraflexure in a beam is where:", options: ["Shear force is zero", "Bending moment is zero", "Deflection is maximum", "Slope is zero"], correct: "Bending moment is zero" },
    { q: "Slenderness ratio of a column is:", options: ["Area/Moment of Inertia", "Effective length/Radius of gyration", "Load/Area", "Moment/Section modulus"], correct: "Effective length/Radius of gyration" },
    { q: "Which theory of failure is used for ductile materials?", options: ["Maximum principal stress", "Maximum shear stress (Tresca)", "Maximum strain energy", "Maximum principal strain"], correct: "Maximum shear stress (Tresca)" },
    { q: "Degree of static indeterminacy of a fixed beam is:", options: ["0", "1", "2", "3"], correct: "3" },
    { q: "Muller-Breslau principle is used for:", options: ["Slope deflection", "Influence lines", "Moment distribution", "Stiffness matrix"], correct: "Influence lines" },
    { q: "The ratio of shear stress at neutral axis to average shear stress for rectangular section is:", options: ["1.0", "1.5", "1.33", "2.0"], correct: "1.5" },
  ],

  "Geotechnical Engineering": [
    { q: "Terzaghi's consolidation theory assumes:", options: ["Non-linear stress-strain", "Fully saturated soil, Darcy's law valid", "Anisotropic permeability", "Large strain"], correct: "Fully saturated soil, Darcy's law valid" },
    { q: "Standard Penetration Test (SPT) N-value is measured at:", options: ["Every 150mm", "Every 300mm after seating drive", "Every 450mm", "At 600mm depth"], correct: "Every 300mm after seating drive" },
    { q: "Active earth pressure coefficient Ka for φ=30° is:", options: ["0.5", "0.33", "0.25", "0.4"], correct: "0.33" },
    { q: "Liquefaction of soil is likely in:", options: ["Dense gravel", "Stiff clay", "Loose saturated sand under dynamic load", "Hard rock"], correct: "Loose saturated sand under dynamic load" },
    { q: "The plasticity index is defined as:", options: ["LL - PL", "LL - SL", "PL - SL", "LL + PL"], correct: "LL - PL" },
  ],

  "Fluid Mechanics": [
    { q: "Bernoulli's equation is applicable for:", options: ["Compressible, viscous flow", "Incompressible, inviscid, steady flow along streamline", "Turbulent flow only", "Any flow condition"], correct: "Incompressible, inviscid, steady flow along streamline" },
    { q: "The Reynolds number for pipe flow above which flow is turbulent:", options: ["500", "2000", "4000", "10000"], correct: "4000" },
    { q: "Hydraulic gradient line (HGL) is:", options: ["Above TEL always", "Pressure head + datum head", "Velocity head + datum head", "Equal to TEL"], correct: "Pressure head + datum head" },
    { q: "The coefficient of discharge for a venturimeter is typically:", options: ["0.5-0.6", "0.6-0.7", "0.95-0.99", "1.0"], correct: "0.95-0.99" },
    { q: "Manning's roughness coefficient 'n' for a smooth concrete channel is approximately:", options: ["0.010-0.013", "0.020-0.025", "0.030-0.035", "0.050-0.060"], correct: "0.010-0.013" },
  ],

  "Transportation Engineering": [
    { q: "CBR test is used to design:", options: ["Bridge foundations", "Flexible pavements", "Rigid pavements", "Retaining walls"], correct: "Flexible pavements" },
    { q: "The stopping sight distance depends on:", options: ["Speed only", "Speed, reaction time, friction coefficient, grade", "Road width only", "Traffic volume"], correct: "Speed, reaction time, friction coefficient, grade" },
    { q: "PCU (Passenger Car Unit) for a truck is approximately:", options: ["1.0", "1.5", "2.0", "3.0"], correct: "2.0" },
    { q: "The superelevation is provided on highways to counteract:", options: ["Gravity", "Centrifugal force on curves", "Wind force", "Braking force"], correct: "Centrifugal force on curves" },
    { q: "Los Angeles abrasion test determines:", options: ["Hardness of aggregate", "Soundness of aggregate", "Toughness", "Stripping value"], correct: "Hardness of aggregate" },
  ],

  // ════════════════════════════════════════════════════════════
  // GATE MECHANICAL
  // ════════════════════════════════════════════════════════════

  "Thermodynamics": [
    { q: "Carnot efficiency between 300K and 500K is:", options: ["40%", "50%", "60%", "20%"], correct: "40%" },
    { q: "Which law of thermodynamics defines entropy?", options: ["Zeroth", "First", "Second", "Third"], correct: "Second" },
    { q: "For an ideal gas, internal energy is a function of:", options: ["Pressure only", "Volume only", "Temperature only", "All three"], correct: "Temperature only" },
    { q: "Throttling process is:", options: ["Isentropic", "Isobaric", "Isenthalpic", "Isothermal"], correct: "Isenthalpic" },
    { q: "COP of refrigerator = ?", options: ["W/QL", "QH/W", "QL/W", "W/QH"], correct: "QL/W" },
  ],

  // ════════════════════════════════════════════════════════════
  // PROGRAMMING — Python
  // ════════════════════════════════════════════════════════════

  "Python": [
    { q: "What is the output of: print(type(1/2))?", options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "Error"], correct: "<class 'float'>" },
    { q: "Which of these creates a shallow copy of a list?", options: ["list.copy()", "list[:]", "copy.copy(list)", "All of these"], correct: "All of these" },
    { q: "What does *args mean in a function definition?", options: ["Pointer argument", "Variable number of keyword arguments", "Variable number of positional arguments", "Required argument"], correct: "Variable number of positional arguments" },
    { q: "What is the time complexity of Python's list.append()?", options: ["O(n)", "O(log n)", "O(1) amortized", "O(n²)"], correct: "O(1) amortized" },
    { q: "Which of the following is immutable in Python?", options: ["List", "Dictionary", "Set", "Tuple"], correct: "Tuple" },
    { q: "What does the GIL (Global Interpreter Lock) prevent in Python?", options: ["Multiple processes", "Multiple threads executing Python bytecode simultaneously", "Garbage collection", "Import of modules"], correct: "Multiple threads executing Python bytecode simultaneously" },
    { q: "What is the output of: [x**2 for x in range(5) if x%2==0]?", options: ["[0,4,16]", "[1,9,25]", "[0,1,4,9,16]", "[4,16]"], correct: "[0,4,16]" },
    { q: "Which method is called when an object is created in Python?", options: ["__create__", "__new__ and __init__", "__start__", "__call__"], correct: "__new__ and __init__" },
  ],

  // ════════════════════════════════════════════════════════════
  // PROGRAMMING — Java
  // ════════════════════════════════════════════════════════════

  "Java": [
    { q: "Which concept allows Java to achieve runtime polymorphism?", options: ["Overloading", "Method overriding with dynamic dispatch", "Abstract classes", "Interfaces"], correct: "Method overriding with dynamic dispatch" },
    { q: "What is the default value of an int in Java?", options: ["null", "undefined", "0", "-1"], correct: "0" },
    { q: "Which keyword prevents a class from being subclassed?", options: ["static", "abstract", "final", "private"], correct: "final" },
    { q: "Java's HashMap has average time complexity for get/put:", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correct: "O(1)" },
    { q: "What is autoboxing in Java?", options: ["Converting object to primitive", "Automatic conversion between primitive and wrapper class", "Memory allocation", "Garbage collection"], correct: "Automatic conversion between primitive and wrapper class" },
    { q: "Which of these is NOT a feature of Java interfaces (Java 8+)?", options: ["Default methods", "Static methods", "Abstract methods", "Instance variables"], correct: "Instance variables" },
    { q: "In Java, String is:", options: ["Primitive type", "Mutable class", "Immutable class", "Interface"], correct: "Immutable class" },
    { q: "What does the volatile keyword do in Java?", options: ["Makes variable constant", "Ensures visibility of changes across threads", "Prevents garbage collection", "Makes method synchronized"], correct: "Ensures visibility of changes across threads" },
  ],

  // ════════════════════════════════════════════════════════════
  // PROGRAMMING — C
  // ════════════════════════════════════════════════════════════

  "C Programming": [
    { q: "What is the output of: printf('%d', sizeof(int)) on a 64-bit system?", options: ["2", "4", "8", "Depends on compiler"], correct: "4" },
    { q: "What does a dangling pointer point to?", options: ["NULL", "Freed/deallocated memory", "Uninitialized memory", "Stack memory"], correct: "Freed/deallocated memory" },
    { q: "Which storage class has default value 0?", options: ["auto", "register", "extern", "static"], correct: "static" },
    { q: "What is the difference between malloc and calloc?", options: ["No difference", "calloc initializes memory to 0, malloc does not", "malloc is faster", "calloc is for arrays only"], correct: "calloc initializes memory to 0, malloc does not" },
    { q: "In C, passing an array to a function passes:", options: ["A copy of the array", "Pointer to the first element", "Size of array", "All elements"], correct: "Pointer to the first element" },
    { q: "What is undefined behavior in C?", options: ["Runtime error", "Compiler warning", "Behavior not defined by C standard — anything can happen", "Syntax error"], correct: "Behavior not defined by C standard — anything can happen" },
    { q: "What does the restrict keyword hint to the compiler?", options: ["Variable is constant", "Pointer is the only reference to its memory — allows optimization", "Function is inline", "Variable is volatile"], correct: "Pointer is the only reference to its memory — allows optimization" },
    { q: "Stack overflow in C is commonly caused by:", options: ["Large heap allocation", "Infinite recursion", "Using printf", "Integer overflow"], correct: "Infinite recursion" },
  ],

  // ════════════════════════════════════════════════════════════
  // APTITUDE
  // ════════════════════════════════════════════════════════════

  "Aptitude": [
    { q: "A train 150m long passes a pole in 15s. Its speed is:", options: ["10 m/s", "15 m/s", "20 m/s", "25 m/s"], correct: "10 m/s" },
    { q: "If A:B = 2:3, B:C = 4:5, then A:B:C is:", options: ["8:12:15", "2:3:5", "6:9:10", "4:6:5"], correct: "8:12:15" },
    { q: "A sum becomes ₹1200 at SI in 2 years and ₹1350 in 3.5 years. Find principal.", options: ["₹900", "₹1000", "₹800", "₹950"], correct: "₹900" },
    { q: "Two pipes fill a tank in 12 and 15 hours. Both open — time to fill:", options: ["6h 40min", "7h", "6h", "8h"], correct: "6h 40min" },
    { q: "A can do a work in 10 days, B in 15 days. Together they finish in:", options: ["6 days", "5 days", "8 days", "12 days"], correct: "6 days" },
    { q: "The HCF of 36, 48, 60 is:", options: ["6", "12", "18", "24"], correct: "12" },
    { q: "If 20% of x = 40% of y, then x:y =", options: ["1:2", "2:1", "1:1", "3:2"], correct: "2:1" },
    { q: "Speed of boat in still water is 10 km/h, stream speed is 2 km/h. Upstream speed:", options: ["8 km/h", "12 km/h", "10 km/h", "6 km/h"], correct: "8 km/h" },
  ],

  // ════════════════════════════════════════════════════════════
  // REASONING
  // ════════════════════════════════════════════════════════════

  "Reasoning": [
    { q: "If all roses are flowers and some flowers are red, then:", options: ["All roses are red", "Some roses may be red", "No roses are red", "All flowers are roses"], correct: "Some roses may be red" },
    { q: "Find the odd one: 2, 5, 10, 17, 26, 37, 50, 64", options: ["37", "50", "64", "26"], correct: "64" },
    { q: "A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?", options: ["Granddaughter", "Daughter", "Sister", "Niece"], correct: "Granddaughter" },
    { q: "In a row of 40 students, if Ravi is 11th from left, his position from right is:", options: ["29th", "30th", "31st", "28th"], correct: "30th" },
    { q: "Pointing to a man, a woman says 'His mother is the only daughter of my mother.' How is the woman related to the man?", options: ["Aunt", "Mother", "Sister", "Grandmother"], correct: "Mother" },
    { q: "If FRIEND is coded as HUMJTK, how is CANDLE coded?", options: ["EDRIRL", "DCQFMJ", "EDRJQM", "FCPFNG"], correct: "EDRIRL" },
    { q: "What comes next: 1, 1, 2, 3, 5, 8, 13, ?", options: ["18", "20", "21", "24"], correct: "21" },
    { q: "In a certain code, 'go home now' = '1 2 3', 'now come back' = '3 4 5'. What is code for 'now'?", options: ["1", "2", "3", "5"], correct: "3" },
  ],

  // ════════════════════════════════════════════════════════════
  // MATHEMATICS (GATE)
  // ════════════════════════════════════════════════════════════

  "Engineering Mathematics": [
    { q: "The rank of a matrix is the maximum number of:", options: ["Rows", "Columns", "Linearly independent rows/columns", "Non-zero elements"], correct: "Linearly independent rows/columns" },
    { q: "Eigenvalues of a symmetric matrix are always:", options: ["Complex", "Real", "Imaginary", "Zero"], correct: "Real" },
    { q: "∫₀^∞ e^(-x²) dx = ?", options: ["√π", "√π/2", "π", "1"], correct: "√π/2" },
    { q: "The divergence of F = xi + yj + zk is:", options: ["0", "1", "3", "x+y+z"], correct: "3" },
    { q: "For a Poisson distribution with mean λ, variance is:", options: ["λ²", "√λ", "λ", "1/λ"], correct: "λ" },
    { q: "The Laplace transform of t·e^(at) is:", options: ["1/(s-a)²", "1/(s+a)", "s/(s-a)²", "a/(s-a)²"], correct: "1/(s-a)²" },
    { q: "A function f(x) is continuous at x=a if:", options: ["f(a) exists", "lim f(x) exists as x→a", "lim f(x) = f(a) as x→a", "f'(a) exists"], correct: "lim f(x) = f(a) as x→a" },
    { q: "The number of spanning trees of a complete graph K4 is:", options: ["8", "12", "16", "24"], correct: "16" },
  ],

};

// ── Helper: get questions for a topic ──────────────────────────────────────
export function getQuestionsForTopic(topicTitle, count = 3) {
  // Try exact match first
  if (quizData[topicTitle]) {
    return shuffle(quizData[topicTitle]).slice(0, count);
  }
  // Try partial match
  const key = Object.keys(quizData).find(k =>
    topicTitle.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(topicTitle.toLowerCase())
  );
  if (key) return shuffle(quizData[key]).slice(0, count);
  return null; // fallback to AI generation
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
