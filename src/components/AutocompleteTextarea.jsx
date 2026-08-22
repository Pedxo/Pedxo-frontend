import {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
  } from "react";
  
  const DEFAULT_SUGGESTIONS = [
    // Common conversational words
    "about",
    "above",
    "according",
    "actually",
    "after",
    "again",
    "also",
    "always",
    "and",
    "another",
    "any",
    "anything",
    "around",
    "because",
    "before",
    "between",
    "both",
    "but",
    "can",
    "could",
    "different",
    "during",
    "each",
    "especially",
    "even",
    "every",
    "example",
    "experience",
    "for",
    "from",
    "further",
    "good",
    "great",
    "have",
    "help",
    "however",
    "important",
    "include",
    "including",
    "into",
    "just",
    "keep",
    "like",
    "looking",
    "make",
    "more",
    "most",
    "much",
    "need",
    "needs",
    "new",
    "next",
    "not",
    "only",
    "other",
    "our",
    "overall",
    "please",
    "prefer",
    "provide",
    "really",
    "required",
    "requirements",
    "should",
    "similar",
    "some",
    "something",
    "specific",
    "start",
    "support",
    "than",
    "that",
    "their",
    "them",
    "there",
    "these",
    "they",
    "this",
    "through",
    "together",
    "understand",
    "use",
    "using",
    "very",
    "want",
    "well",
    "with",
    "without",
    "would",
    "you",
    "your",
  
    // Work / hiring vocabulary
    "ability",
    "adaptable",
    "analytical",
    "applicant",
    "background",
    "candidate",
    "collaboration",
    "communication",
    "creative",
    "developer",
    "development",
    "documentation",
    "efficient",
    "engineering",
    "experience",
    "experienced",
    "flexible",
    "leadership",
    "manager",
    "professional",
    "project",
    "responsibility",
    "responsibilities",
    "reliable",
    "research",
    "solution",
    "technical",
    "team",
    "teamwork",
    "testing",
    "workflow",
  
    // Common technical vocabulary
    "API",
    "Android",
    "Angular",
    "AWS",
    "backend",
    "Bootstrap",
    "CSS",
    "database",
    "Docker",
    "Express",
    "Firebase",
    "frontend",
    "Git",
    "GitHub",
    "HTML",
    "Java",
    "JavaScript",
    "Kotlin",
    "MongoDB",
    "MySQL",
    "Node",
    "Node.js",
    "Next.js",
    "PostgreSQL",
    "Python",
    "React",
    "React Native",
    "Redux",
    "REST",
    "SQL",
    "Supabase",
    "Tailwind",
    "TypeScript",
    "Vue",
    "web",
    "mobile",
    
  
    // Common requirement words
    "build",
    "create",
    "design",
    "develop",
    "implement",
    "integrate",
    "maintain",
    "optimize",
    "review",
    "secure",
    "deploy",
    "debug",
    "manage",
    "improve",
    "configure",
    "connect",
    "ensure",
    "deliver",
    "handle",
    "solve",
    "write",
    "followers",
    "urgent",
    "following",
    "understanding",
    "understand",
    "great",
    "talented",
    "talents",
    "job",
    "amount",
    "career",
    "team",
    "good",
    "writing",
    "simple",
    "easy",
    "hardly",
    "hard",
    "foreign",
    "capable",
    "resolve",
    "moment",
    "lead",
    "role",
    "leading",
    "land",
    "learn",
    "learning",
    "co-worker",
    "know",
    "knowledge",
    "action",
    "play",
    "playing",
    "plan",
    "focus",
    "acknowledge",
    "render",
    "knowing",
    "such",
    "scope",
    "add",
    "group"
  ];
  
  const AutocompleteTextarea = ({
    value,
    onChange,
    onBlur,
    name,
    id,
    rows = 7,
    placeholder,
    className,
    style,
    maxSuggestions = 7,
    suggestions = DEFAULT_SUGGESTIONS,
  }) => {
    const textareaRef = useRef(null);
    const containerRef = useRef(null);
  
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
  
    /*
     * NEW:
     * Position of the autocomplete dropdown relative
     * to the textarea wrapper.
     */
    const [suggestionPosition, setSuggestionPosition] = useState({
      top: 0,
      left: 0,
    });
  
    /*
     * Get the word currently being typed.
     *
     * Example:
     *
     * "We need a React devel"
     *
     * currentWord = "devel"
     */
    const currentWord = useMemo(() => {
      const textarea = textareaRef.current;
  
      if (!textarea) {
        const match = value?.match(/[\w.-]+$/);
        return match ? match[0] : "";
      }
  
      const cursorPosition = textarea.selectionStart ?? value.length;
  
      const textBeforeCursor = value.slice(0, cursorPosition);
  
      const match = textBeforeCursor.match(/[\w.-]+$/);
  
      return match ? match[0] : "";
    }, [value]);
  
    /*
     * Filter suggestions based on the word currently being typed.
     */
    const filteredSuggestions = useMemo(() => {
      if (!currentWord || currentWord.length < 2) {
        return [];
      }
  
      const searchTerm = currentWord.toLowerCase();
  
      return suggestions
        .filter((word) => {
          if (!word) return false;
  
          const lowerWord = word.toLowerCase();
  
          return (
            lowerWord.startsWith(searchTerm) &&
            lowerWord !== searchTerm
          );
        })
        .filter(
          (word, index, array) =>
            array.findIndex(
              (item) => item.toLowerCase() === word.toLowerCase(),
            ) === index,
        )
        .slice(0, maxSuggestions);
    }, [currentWord, suggestions, maxSuggestions]);
  
    /*
     * ---------------------------------------------------------
     * NEW:
     * Calculate the actual caret position inside the textarea.
     *
     * This allows the suggestion box to appear directly
     * underneath the word currently being typed instead of
     * being positioned at the bottom of the textarea.
     * ---------------------------------------------------------
     */
    const updateSuggestionPosition = () => {
      const textarea = textareaRef.current;
      const container = containerRef.current;
  
      if (!textarea || !container) return;
  
      const cursorPosition =
        textarea.selectionStart ?? value.length;
  
      /*
       * Create a hidden mirror of the textarea.
       *
       * The mirror uses the exact same font, padding,
       * line-height, width, etc. so that text wraps in the
       * same position as it does inside the real textarea.
       */
      const mirror = document.createElement("div");
  
      const computedStyle = window.getComputedStyle(textarea);
  
      const properties = [
        "fontFamily",
        "fontSize",
        "fontWeight",
        "fontStyle",
        "letterSpacing",
        "lineHeight",
        "textTransform",
        "wordSpacing",
        "textIndent",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "boxSizing",
        "whiteSpace",
        "wordWrap",
        "overflowWrap",
      ];
  
      properties.forEach((property) => {
        mirror.style[property] = computedStyle[property];
      });
  
      /*
       * Match the textarea's available width.
       */
      mirror.style.position = "absolute";
      mirror.style.visibility = "hidden";
      mirror.style.pointerEvents = "none";
      mirror.style.left = "0";
      mirror.style.top = "0";
      mirror.style.width = `${textarea.clientWidth}px`;
      mirror.style.height = "auto";
      mirror.style.minHeight = "0";
      mirror.style.maxHeight = "none";
      mirror.style.overflow = "visible";
  
      /*
       * Important for textarea line wrapping.
       */
      mirror.style.whiteSpace = "pre-wrap";
      mirror.style.overflowWrap = "break-word";
      mirror.style.wordBreak = "break-word";
  
      /*
       * Text before the cursor.
       */
      const textBeforeCursor = value.slice(
        0,
        cursorPosition,
      );
  
      /*
       * Preserve spaces/new lines so the mirror has the
       * same layout as the textarea.
       */
      const textNode = document.createTextNode(
        textBeforeCursor || "\u200B",
      );
  
      mirror.appendChild(textNode);
  
      /*
       * Marker represents the exact cursor position.
       */
      const marker = document.createElement("span");
  
      marker.textContent = "\u200B";
  
      mirror.appendChild(marker);
  
      document.body.appendChild(mirror);
  
      /*
       * Calculate the marker position inside the mirror.
       */
      const markerRect = marker.getBoundingClientRect();
      const mirrorRect = mirror.getBoundingClientRect();
      const textareaRect = textarea.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
  
      /*
       * Calculate the cursor's position relative to
       * the AutocompleteTextarea container.
       */
      let left =
        textareaRect.left -
        containerRect.left +
        (markerRect.left - mirrorRect.left) -
        textarea.scrollLeft;
  
      let top =
        textareaRect.top -
        containerRect.top +
        (markerRect.top - mirrorRect.top) -
        textarea.scrollTop;
  
      /*
       * Put the suggestion box BELOW the current line.
       *
       * markerRect.height gives us the line/cursor height.
       */
      top += Math.max(markerRect.height, 20);
  
      /*
       * Keep the dropdown inside the textarea horizontally.
       */
      const suggestionWidth = 260;
  
      const maxLeft =
        container.clientWidth - suggestionWidth - 8;
  
      left = Math.max(
        8,
        Math.min(left, Math.max(8, maxLeft)),
      );
  
      /*
       * Remove the temporary mirror.
       */
      document.body.removeChild(mirror);
  
      setSuggestionPosition({
        top,
        left,
      });
    };
  
    /*
     * Update position whenever the suggestions become
     * visible or the value changes.
     */
    useLayoutEffect(() => {
      if (
        showSuggestions &&
        filteredSuggestions.length > 0
      ) {
        updateSuggestionPosition();
      }
    }, [
      value,
      currentWord,
      showSuggestions,
      filteredSuggestions,
    ]);
  
    /*
     * Recalculate position when the textarea is scrolled.
     */
    useEffect(() => {
      const textarea = textareaRef.current;
  
      if (!textarea) return;
  
      const handleScroll = () => {
        if (
          showSuggestions &&
          filteredSuggestions.length > 0
        ) {
          updateSuggestionPosition();
        }
      };
  
      textarea.addEventListener("scroll", handleScroll);
  
      return () => {
        textarea.removeEventListener(
          "scroll",
          handleScroll,
        );
      };
    }, [
      showSuggestions,
      filteredSuggestions.length,
      value,
    ]);
  
    /*
     * Recalculate when the browser window changes size.
     */
    useEffect(() => {
      const handleResize = () => {
        if (
          showSuggestions &&
          filteredSuggestions.length > 0
        ) {
          updateSuggestionPosition();
        }
      };
  
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener(
          "resize",
          handleResize,
        );
      };
    }, [
      showSuggestions,
      filteredSuggestions.length,
      value,
    ]);
  
    /*
     * Show/hide suggestions whenever the available
     * suggestions change.
     */
    useEffect(() => {
      if (filteredSuggestions.length > 0) {
        setShowSuggestions(true);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
        setSelectedIndex(0);
      }
    }, [filteredSuggestions]);
  
    /*
     * Insert selected suggestion at the current cursor position.
     */
    const insertSuggestion = (suggestion) => {
      const textarea = textareaRef.current;
  
      if (!textarea) return;
  
      const cursorPosition =
        textarea.selectionStart ?? value.length;
  
      const textBeforeCursor = value.slice(
        0,
        cursorPosition,
      );
  
      const textAfterCursor = value.slice(
        cursorPosition,
      );
  
      /*
       * Remove the incomplete word currently being typed.
       */
      const wordMatch =
        textBeforeCursor.match(/[\w.-]+$/);
  
      const wordStart = wordMatch
        ? cursorPosition - wordMatch[0].length
        : cursorPosition;
  
      const beforeWord = value.slice(
        0,
        wordStart,
      );
  
      /*
       * Add a space after the selected suggestion so the user
       * can immediately continue typing.
       */
      const newValue = `${beforeWord}${suggestion} ${textAfterCursor}`;
  
      onChange({
        target: {
          name,
          value: newValue,
        },
      });
  
      setShowSuggestions(false);
  
      /*
       * Restore the cursor after the inserted suggestion.
       */
      requestAnimationFrame(() => {
        const newCursorPosition =
          beforeWord.length +
          suggestion.length +
          1;
  
        textarea.focus();
  
        textarea.setSelectionRange(
          newCursorPosition,
          newCursorPosition,
        );
      });
    };
  
    /*
     * Keyboard navigation.
     */
    const handleKeyDown = (event) => {
      if (
        !showSuggestions ||
        filteredSuggestions.length === 0
      ) {
        return;
      }
  
      if (event.key === "ArrowDown") {
        event.preventDefault();
  
        setSelectedIndex((previous) =>
          previous <
          filteredSuggestions.length - 1
            ? previous + 1
            : 0,
        );
  
        return;
      }
  
      if (event.key === "ArrowUp") {
        event.preventDefault();
  
        setSelectedIndex((previous) =>
          previous > 0
            ? previous - 1
            : filteredSuggestions.length - 1,
        );
  
        return;
      }
  
      if (event.key === "Enter") {
        /*
         * Only autocomplete when a suggestion is actively displayed.
         * Otherwise Enter behaves normally and creates a new line.
         */
        if (showSuggestions) {
          event.preventDefault();
  
          insertSuggestion(
            filteredSuggestions[selectedIndex],
          );
        }
  
        return;
      }
  
      if (event.key === "Escape") {
        setShowSuggestions(false);
      }
    };
  
    const handleChange = (event) => {
      onChange(event);
    };
  
    const handleFocus = () => {
      if (filteredSuggestions.length > 0) {
        setShowSuggestions(true);
  
        requestAnimationFrame(() => {
          updateSuggestionPosition();
        });
      }
    };
  
    const handleBlur = (event) => {
      /*
       * Delay closing slightly so a mouse click on a suggestion
       * can complete before the textarea loses focus.
       */
      setTimeout(() => {
        setShowSuggestions(false);
      }, 150);
  
      if (onBlur) {
        onBlur(event);
      }
    };
  
    /*
     * Close suggestions when clicking outside the component.
     */
    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(
            event.target,
          )
        ) {
          setShowSuggestions(false);
        }
      };
  
      document.addEventListener(
        "mousedown",
        handleOutsideClick,
      );
  
      return () => {
        document.removeEventListener(
          "mousedown",
          handleOutsideClick,
        );
      };
    }, []);
  
    return (
      <div
        ref={containerRef}
        className="relative w-full"
      >
        <textarea
          ref={textareaRef}
          name={name}
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={className}
          style={style}
          autoComplete="off"
          spellCheck="true"
        />
  
        {showSuggestions &&
          filteredSuggestions.length > 0 && (
            <div
              className="
                absolute
                z-50
                max-h-[180px]
                w-[260px]
                overflow-y-auto
                rounded-lg
                border
                border-gray-200
                bg-white
                shadow-lg
              "
              style={{
                top: `${suggestionPosition.top}px`,
                left: `${suggestionPosition.left}px`,
              }}
            >
              {filteredSuggestions.map(
                (suggestion, index) => (
                  <button
                    key={`${suggestion}-${index}`}
                    type="button"
                    onMouseDown={(event) => {
                      /*
                       * Prevent textarea blur from happening
                       * before the suggestion is selected.
                       */
                      event.preventDefault();
  
                      insertSuggestion(
                        suggestion,
                      );
                    }}
                    className={`
                      block
                      w-full
                      cursor-pointer
                      px-3
                      py-2
                      text-left
                      text-sm
                      transition-colors
                      ${
                        index === selectedIndex
                          ? "bg-gray-100 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    {suggestion}
                  </button>
                ),
              )}
            </div>
          )}
      </div>
    );
  };
  
  export default AutocompleteTextarea;