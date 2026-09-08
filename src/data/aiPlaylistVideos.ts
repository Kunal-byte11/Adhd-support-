export interface AiVideoItem {
  id: string;
  courseId: string;
  videoIndex: number;
  title: string;
  durationTimestamp: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  description: string;
  startSeconds?: number;
}

export const AI_PLAYLIST_VIDEOS: Record<string, AiVideoItem[]> = {
  "ai-res-1": [
    {
      "id": "ai-py-1",
      "courseId": "ai-res-1",
      "videoIndex": 1,
      "title": "Print Function in Python | 100 Days of Python Programming",
      "durationTimestamp": "7:04",
      "thumbnailUrl": "https://i.ytimg.com/vi/u1RKh1kQqaE/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=u1RKh1kQqaE",
      "description": "In this video, we'll explore the ins and outs of printing in Python. From basic syntax to advanced formatting tricks, join us on a journey to master the art of displaying information in your Python scripts. Code used: https://github.com/campusx-of..."
    },
    {
      "id": "ai-py-2",
      "courseId": "ai-res-1",
      "videoIndex": 2,
      "title": "Data Types in Python | 100 Days of Python Programming",
      "durationTimestamp": "7:59",
      "thumbnailUrl": "https://i.ytimg.com/vi/NQ0JI5IKggI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=NQ0JI5IKggI",
      "description": "In this video, we'll break down the fundamental building blocks that store and represent information. From numbers and strings to lists and dictionaries, join us on a journey to understand how Python handles different types of data. Code used: htt..."
    },
    {
      "id": "ai-py-3",
      "courseId": "ai-res-1",
      "videoIndex": 3,
      "title": "Comments in Python | 100 Days of Python Programming",
      "durationTimestamp": "3:08",
      "thumbnailUrl": "https://i.ytimg.com/vi/JAigPIhUIM8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=JAigPIhUIM8",
      "description": "In this video, we'll guide you through the significance of comments and their impact on code readability. From single-line comments to multi-line explanations, join us as we explore how comments play a crucial role in conveying your thoughts and e..."
    },
    {
      "id": "ai-py-4",
      "courseId": "ai-res-1",
      "videoIndex": 4,
      "title": "Variables in Python | Dynamic Typing | Dynamic Binding in Python",
      "durationTimestamp": "10:17",
      "thumbnailUrl": "https://i.ytimg.com/vi/_pNx8uEmHI0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=_pNx8uEmHI0",
      "description": "In this video, we'll unravel the concepts of dynamic typing and dynamic binding, exploring how Python manages and adapts variables during runtime. Code : https://github.com/campusx-official/100-days-of-python-programming/tree/main/day2-variables-k..."
    },
    {
      "id": "ai-py-5",
      "courseId": "ai-res-1",
      "videoIndex": 5,
      "title": "Keywords and Identifiers in Python",
      "durationTimestamp": "8:27",
      "thumbnailUrl": "https://i.ytimg.com/vi/QmSL27U7RDc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=QmSL27U7RDc",
      "description": "Let's uncover the ABCs of Python coding with this video on keywords and identifiers. Learn the fundamental building blocks that make up Python's vocabulary, including reserved keywords and user-defined identifiers. Code : https://github.com/campus..."
    },
    {
      "id": "ai-py-6",
      "courseId": "ai-res-1",
      "videoIndex": 6,
      "title": "Taking user input in Python | The input function",
      "durationTimestamp": "10:25",
      "thumbnailUrl": "https://i.ytimg.com/vi/15sdH57DtsU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=15sdH57DtsU",
      "description": "The input() Function: Dive into the interactive side of Python with this video on taking user input. We'll explore the 'input()' function, understanding the process of gathering information directly from users. Code used: https://github.com/campus..."
    },
    {
      "id": "ai-py-7",
      "courseId": "ai-res-1",
      "videoIndex": 7,
      "title": "Type Conversion in Python",
      "durationTimestamp": "8:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/YjLFP8pW764/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=YjLFP8pW764",
      "description": "Discover how to seamlessly convert one data type to another, allowing flexibility in your code. Join us on this journey to understand the importance of type conversion and its practical applications in Python programming. Code used: https://github..."
    },
    {
      "id": "ai-py-8",
      "courseId": "ai-res-1",
      "videoIndex": 8,
      "title": "Literals in Python | 100 Days of Python Programming",
      "durationTimestamp": "9:49",
      "thumbnailUrl": "https://i.ytimg.com/vi/u6UpEKy_ocM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=u6UpEKy_ocM",
      "description": "In this video, learn about different types of literals, from numeric and string literals to Boolean and special literals. Code: https://github.com/campusx-official/100-days-of-python-programming/tree/main/day6-literals-and-operators"
    },
    {
      "id": "ai-py-9",
      "courseId": "ai-res-1",
      "videoIndex": 9,
      "title": "Operators in Python | 100 Days of Python Programming",
      "durationTimestamp": "15:31",
      "thumbnailUrl": "https://i.ytimg.com/vi/cPmiugHYvSI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=cPmiugHYvSI",
      "description": "We'll cover the various types of operators, from arithmetic and comparison to logical and assignment operators. Join us on this coding adventure to understand how operators enable you to perform diverse operations, making your Python programs dyna..."
    },
    {
      "id": "ai-py-10",
      "courseId": "ai-res-1",
      "videoIndex": 10,
      "title": "If-else Statements in Python | Nested If-else | Day 7 | 100 Days of Python Programming",
      "durationTimestamp": "13:22",
      "thumbnailUrl": "https://i.ytimg.com/vi/EHxqc8Vy3H8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=EHxqc8Vy3H8",
      "description": "If-else Statements in Python | Nested If-else: Master the art of decision-making in Python with this video on if-else statements, including nested if-else structures. We'll guide you through the syntax and usage of these fundamental control flow s..."
    },
    {
      "id": "ai-py-11",
      "courseId": "ai-res-1",
      "videoIndex": 11,
      "title": "Indentation in Python | Day 7 | 100 Days of Python Programming",
      "durationTimestamp": "9:08",
      "thumbnailUrl": "https://i.ytimg.com/vi/PbpuN5yI68o/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=PbpuN5yI68o",
      "description": "Indentation in Python: Uncover the significance of indentation in Python programming with this video. Learn why proper indentation is crucial for code structure and readability. Code used: https://github.com/campusx-official/100-days-of-python-pro..."
    },
    {
      "id": "ai-py-12",
      "courseId": "ai-res-1",
      "videoIndex": 12,
      "title": "While Loop in Python | Day 8 | 100 Days of Python Programming",
      "durationTimestamp": "11:09",
      "thumbnailUrl": "https://i.ytimg.com/vi/fGckTEH5DPI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=fGckTEH5DPI",
      "description": "Learn the power of repetitive tasks with this video on while loops in Python. Learn how to create loops that continue executing as long as a certain condition is true. Code used: https://github.com/campusx-official/100-days-of-python-programming/t..."
    },
    {
      "id": "ai-py-13",
      "courseId": "ai-res-1",
      "videoIndex": 13,
      "title": "Guessing Game in Python",
      "durationTimestamp": "9:22",
      "thumbnailUrl": "https://i.ytimg.com/vi/Ai4fEP-QKSI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Ai4fEP-QKSI",
      "description": "Learn how to build a simple yet engaging program that challenges users to guess a number. Join us on this hands-on journey to enhance your Python skills and create interactive games with ease. Code used: https://github.com/campusx-official/100-day..."
    },
    {
      "id": "ai-py-14",
      "courseId": "ai-res-1",
      "videoIndex": 14,
      "title": "For Loop In Python",
      "durationTimestamp": "9:38",
      "thumbnailUrl": "https://i.ytimg.com/vi/mMCelsWjfac/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=mMCelsWjfac",
      "description": "Discover the syntax and functionality of for loops, a versatile tool for executing a block of code multiple times. Join us on this coding journey to understand how for loops enhance the efficiency and readability of your Python programs. Code used..."
    },
    {
      "id": "ai-py-15",
      "courseId": "ai-res-1",
      "videoIndex": 15,
      "title": "Nested Loops in Python",
      "durationTimestamp": "6:51",
      "thumbnailUrl": "https://i.ytimg.com/vi/QU3zhcSBWKU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=QU3zhcSBWKU",
      "description": "Dive into the world of complex iterations with this video on nested loops in Python. Learn how to use multiple loops within each other to solve intricate problems and handle multidimensional data. Code used: https://github.com/campusx-official/100..."
    },
    {
      "id": "ai-py-16",
      "courseId": "ai-res-1",
      "videoIndex": 16,
      "title": "Break, Continue and Pass Statements in Python",
      "durationTimestamp": "7:38",
      "thumbnailUrl": "https://i.ytimg.com/vi/lgs_o6mDzdU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=lgs_o6mDzdU",
      "description": "Break, Continue, and Pass statements in Python are essential for controlling the flow of loops. 'Break' terminates the loop prematurely when a condition is met, 'Continue' skips the rest of the code within a loop for a specific condition, and 'Pas..."
    },
    {
      "id": "ai-py-17",
      "courseId": "ai-res-1",
      "videoIndex": 17,
      "title": "Built-in Functions in Python",
      "durationTimestamp": "10:41",
      "thumbnailUrl": "https://i.ytimg.com/vi/hCMnJT14XTw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=hCMnJT14XTw",
      "description": "Built-in functions in Python are pre-defined functions that come with the Python interpreter. These functions serve various purposes, from performing basic operations like 'len()' for getting the length of an object to more complex tasks like 'sum..."
    },
    {
      "id": "ai-py-18",
      "courseId": "ai-res-1",
      "videoIndex": 18,
      "title": "Built-in Modules in Python | How to use Modules in Python",
      "durationTimestamp": "10:15",
      "thumbnailUrl": "https://i.ytimg.com/vi/sM5-_9bJgdw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=sM5-_9bJgdw",
      "description": "Code used: https://github.com/campusx-official/100-days-of-python-programming/tree/main/day9-built-in-functions-and-modules About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to stud..."
    },
    {
      "id": "ai-py-19",
      "courseId": "ai-res-1",
      "videoIndex": 19,
      "title": "Strings in Python | Part 1",
      "durationTimestamp": "6:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/cNy9Pc35fRw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=cNy9Pc35fRw",
      "description": "This video simplifies the process of accessing substrings, offering practical examples to boost your understanding of Python string operations. Code used: https://github.com/campusx-official/100-days-of-python-programming/tree/main/day10-strings R..."
    },
    {
      "id": "ai-py-20",
      "courseId": "ai-res-1",
      "videoIndex": 20,
      "title": "Accessing Substrings from a String | Indexing and Slicing in Python Strings | Part 2",
      "durationTimestamp": "10:31",
      "thumbnailUrl": "https://i.ytimg.com/vi/ue1dZQKKLM8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ue1dZQKKLM8",
      "description": "This video simplifies the process of accessing substrings, offering practical examples to boost your understanding of Python string operations. Code used: https://github.com/campusx-official/100-days-of-python-programming/tree/main/day10-strings"
    },
    {
      "id": "ai-py-21",
      "courseId": "ai-res-1",
      "videoIndex": 21,
      "title": "Editing and Deleting Strings in Python | Part 3",
      "durationTimestamp": "4:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/DZmJxCEfkCs/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=DZmJxCEfkCs",
      "description": "This video guides you through editing and deleting operations, providing practical insights to enhance your Python programming skills. Code Used: https://github.com/campusx-official/100-days-of-python-programming/tree/main/day10-strings"
    },
    {
      "id": "ai-py-22",
      "courseId": "ai-res-1",
      "videoIndex": 22,
      "title": "String Operations in Python | Part 4",
      "durationTimestamp": "8:36",
      "thumbnailUrl": "https://i.ytimg.com/vi/Hc-Dwy35DRQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Hc-Dwy35DRQ",
      "description": "This video breaks down various string operations, making it easy to understand and apply in your Python coding. Enhance your skills and level up your programming game! Code used: https://github.com/campusx-official/100-days-of-python-programming/t..."
    },
    {
      "id": "ai-py-23",
      "courseId": "ai-res-1",
      "videoIndex": 23,
      "title": "String Functions in Python | Part 5",
      "durationTimestamp": "19:07",
      "thumbnailUrl": "https://i.ytimg.com/vi/iMToFoTl2Z8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=iMToFoTl2Z8",
      "description": "Learn essential string functions in Python that make handling and processing text a breeze. Watch and learn how to use these functions for efficient string manipulation in your Python projects. Code used: https://github.com/campusx-official/100-da..."
    },
    {
      "id": "ai-py-24",
      "courseId": "ai-res-1",
      "videoIndex": 24,
      "title": "Python Lists | Complete Explanation in Hindi |  100 Days of Python Programing",
      "durationTimestamp": "33:48",
      "thumbnailUrl": "https://i.ytimg.com/vi/l0rgITwCXKg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=l0rgITwCXKg",
      "description": "Lists in Python are versatile and mutable collections that can store multiple items of different data types. They are created using square brackets and support various operations like adding, removing, and modifying elements. Lists are commonly us..."
    },
    {
      "id": "ai-py-25",
      "courseId": "ai-res-1",
      "videoIndex": 25,
      "title": "Python Tuples | Complete Explanation in Hindi | 100 Days of Python Programming",
      "durationTimestamp": "12:15",
      "thumbnailUrl": "https://i.ytimg.com/vi/-ePqwviZx4I/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=-ePqwviZx4I",
      "description": "Tuples in Python are similar to lists, but they are immutable, meaning their elements cannot be changed after creation. They are created using parentheses and can store different data types. Tuples are often used when the data should remain consta..."
    },
    {
      "id": "ai-py-26",
      "courseId": "ai-res-1",
      "videoIndex": 26,
      "title": "Python Sets  | Complete Explanation in Hindi | 100 Days of Python Programming",
      "durationTimestamp": "18:05",
      "thumbnailUrl": "https://i.ytimg.com/vi/XPDzwN1aXAQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=XPDzwN1aXAQ",
      "description": "In Python, sets are collections of unique elements. Unlike lists or tuples, sets don't allow duplicate values. They provide efficient methods for common set operations like union, intersection, and difference. Sets are handy for tasks requiring un..."
    },
    {
      "id": "ai-py-27",
      "courseId": "ai-res-1",
      "videoIndex": 27,
      "title": "Python Dictionary | Complete Explanation in Hindi | 100 Days of Python Programming",
      "durationTimestamp": "17:29",
      "thumbnailUrl": "https://i.ytimg.com/vi/39FONNQb-vc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=39FONNQb-vc",
      "description": "Python dictionaries are powerful data structures that store key-value pairs. Think of them like real-world dictionaries, where you look up words to find their meanings. In Python, you use keys to access values, making it efficient for data retriev..."
    },
    {
      "id": "ai-py-28",
      "courseId": "ai-res-1",
      "videoIndex": 28,
      "title": "Python Deep Dive | Mutability | Garbage Collection | Variable Referencing",
      "durationTimestamp": "51:30",
      "thumbnailUrl": "https://i.ytimg.com/vi/GaJ_LmHd0E8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=GaJ_LmHd0E8",
      "description": "Mutability refers to the ability of objects to be changed after creation, influencing how data is stored and manipulated. Garbage collection is Python's automatic memory management system, responsible for reclaiming memory occupied by objects that..."
    },
    {
      "id": "ai-py-29",
      "courseId": "ai-res-1",
      "videoIndex": 29,
      "title": "Functions in Python | End to End Video | Complete Video",
      "durationTimestamp": "1:03:35",
      "thumbnailUrl": "https://i.ytimg.com/vi/XTVP2gS6ftk/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=XTVP2gS6ftk",
      "description": "In this tutorial, we'll cover end to end about functions in python. If you find this video helpful, consider giving it a thumbs up and subscribing for more educational videos on data science! Share your thoughts, experiences, or questions in the c..."
    },
    {
      "id": "ai-py-30",
      "courseId": "ai-res-1",
      "videoIndex": 30,
      "title": "Recursion using Python | Recursion with examples | Memoization",
      "durationTimestamp": "45:07",
      "thumbnailUrl": "https://i.ytimg.com/vi/cNvZK0Wyoik/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=cNvZK0Wyoik",
      "description": "This tutorial explores the concept of recursion, providing clear examples to deepen your understanding. Discover the elegance of solving problems through recursive functions and learn how to implement memoization for optimized performance."
    },
    {
      "id": "ai-py-31",
      "courseId": "ai-res-1",
      "videoIndex": 31,
      "title": "Lambda Functions in Python | Map, Filter and Reduce | Higher Order Functions in Python",
      "durationTimestamp": "34:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/ww2uPkwSjjY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ww2uPkwSjjY",
      "description": "In this tutorial, we delve into the world of anonymous functions and explore how Lambda functions streamline your code. Learn how to use Lambda with Map, Filter, and Reduce functions, and grasp the concept of higher-order functions."
    },
    {
      "id": "ai-py-32",
      "courseId": "ai-res-1",
      "videoIndex": 32,
      "title": "Complete OOP in Python in 1 Video | End to End OOP in Python in 4 hours",
      "durationTimestamp": "4:02:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/Mf2RdpEiXjU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Mf2RdpEiXjU",
      "description": "If you find this video helpful, consider giving it a thumbs up and subscribing for more educational videos on data science! Share your thoughts, experiences, or questions in the comments below. I love hearing from you!"
    },
    {
      "id": "ai-py-33",
      "courseId": "ai-res-1",
      "videoIndex": 33,
      "title": "100 Python Problems with Solutions for Beginners | Most Common Python Programs for Practice",
      "durationTimestamp": "6:53",
      "thumbnailUrl": "https://i.ytimg.com/vi/szkZ1DwABUs/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=szkZ1DwABUs",
      "description": "In this video, we present '100 Python Problems with Solutions for Beginners.' If you're starting your Python journey or looking to enhance your skills, this compilation of common Python programs is designed for hands-on practice. From basic concep..."
    },
    {
      "id": "ai-py-34",
      "courseId": "ai-res-1",
      "videoIndex": 34,
      "title": "Threading | Threading and Multi Processing in Python Part 1",
      "durationTimestamp": "19:12",
      "thumbnailUrl": "https://i.ytimg.com/vi/Vdz0usYmSsU/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Vdz0usYmSsU",
      "description": "Threading is a very important concept for parallelization. In this video, we explain: - What is Threading? - When and Where Threading is Used? - Implementation in Python - Synchronizing multiple Threads Music: https://www.bensound.com/ (00:00): In..."
    },
    {
      "id": "ai-py-35",
      "courseId": "ai-res-1",
      "videoIndex": 35,
      "title": "What is Iterators in Python?",
      "durationTimestamp": "38:09",
      "thumbnailUrl": "https://i.ytimg.com/vi/pH7YVRhnpUI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=pH7YVRhnpUI",
      "description": "In this video, we'll explore what Iterators are and how they elevate your Python programming experience. Join us for a straightforward explanation, and learn how to use Iterators effectively in your code. Code - https://github.com/campusx-official..."
    },
    {
      "id": "ai-py-36",
      "courseId": "ai-res-1",
      "videoIndex": 36,
      "title": "Generators in Python | Advanced Python Programming",
      "durationTimestamp": "24:53",
      "thumbnailUrl": "https://i.ytimg.com/vi/ZfJoU67tG1A/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ZfJoU67tG1A",
      "description": "In this video, we'll  learn the concept of Generators, a dynamic feature that enhances efficiency in Python programming. Code - https://github.com/campusx-official/python-generators"
    },
    {
      "id": "ai-py-37",
      "courseId": "ai-res-1",
      "videoIndex": 37,
      "title": "Build GUIs Using Python | Python Tkinter in 30 mins | Login App GUI",
      "durationTimestamp": "28:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/D0xVD8eUk4o/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=D0xVD8eUk4o",
      "description": "Tkinter is the de facto way in Python to create Graphical User interfaces (GUIs) and is included in all standard Python Distributions. In fact, it's the only framework built into the Python standard library. Code - https://github.com/campusx-offic..."
    },
    {
      "id": "ai-py-38",
      "courseId": "ai-res-1",
      "videoIndex": 38,
      "title": "Wallpaper Viewer Application using Python | Tkinter GUI Tutorial | Mini Project",
      "durationTimestamp": "13:26",
      "thumbnailUrl": "https://i.ytimg.com/vi/vjh0Cqudqa0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=vjh0Cqudqa0",
      "description": "Tkinter is the de facto way in Python to create Graphical User interfaces (GUIs) and is included in all standard Python Distributions. In fact, it's the only framework built into the Python standard library. In this video, I have developed a small..."
    },
    {
      "id": "ai-py-39",
      "courseId": "ai-res-1",
      "videoIndex": 39,
      "title": "Calculator GUI Application using Python | Tkinter Tutorial | Python Mini Project",
      "durationTimestamp": "29:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/owbU6WzIhhg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=owbU6WzIhhg",
      "description": "In this video, we guide you through creating a simple yet powerful calculator with a graphical user interface (GUI). Tkinter is a built-in python module using which you can build GUIs in Python. Whether you're a Python beginner or looking for a fu..."
    },
    {
      "id": "ai-py-40",
      "courseId": "ai-res-1",
      "videoIndex": 40,
      "title": "News Application in Python | Inshorts Clone using Python | GUI + OOP + API Tutorial in Python",
      "durationTimestamp": "34:26",
      "thumbnailUrl": "https://i.ytimg.com/vi/b-YBvPmCTew/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=b-YBvPmCTew",
      "description": "In this video, we will build a news application like Inshorts using Python. We will be fetching the data from the following website(API): https://newsapi.org/ We will be building this application using GUI and OOP. Check the code here: https://git..."
    }
  ],
  "ai-res-3": [
    {
      "id": "ai-ml-1",
      "courseId": "ai-res-3",
      "videoIndex": 1,
      "title": "What is Machine Learning? | 100 Days of Machine Learning",
      "durationTimestamp": "20:00",
      "thumbnailUrl": "https://i.ytimg.com/vi/ZftI2fEz0Fw/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ZftI2fEz0Fw",
      "description": "Machine learning is the study of computer algorithms that can improve automatically through experience and by the use of data. It is seen as a part of artificial intelligence. Machine learning algorithms build a model based on sample data, known a..."
    },
    {
      "id": "ai-ml-2",
      "courseId": "ai-res-3",
      "videoIndex": 2,
      "title": "AI Vs ML Vs DL for Beginners in Hindi",
      "durationTimestamp": "16:02",
      "thumbnailUrl": "https://i.ytimg.com/vi/1v3_AQ26jZ0/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=1v3_AQ26jZ0",
      "description": "AI is an umbrella discipline that covers everything related to making machines smarter. Machine Learning (ML) is commonly used along with AI but it is a subset of AI. ML refers to an AI system that can self-learn based on the algorithm. Systems th..."
    },
    {
      "id": "ai-ml-3",
      "courseId": "ai-res-3",
      "videoIndex": 3,
      "title": "Types of Machine Learning for Beginners | Types of Machine learning in Hindi | Types of ML in Depth",
      "durationTimestamp": "27:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/81ymPYEtFOw/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=81ymPYEtFOw",
      "description": "In this video, what are the various types of Machine Learning and their sub-types. Types of learning that you must be familiar with as a machine learning practitioner are: 1. Supervised Machine Learning 2. Semi-supervised Learning 3. Unsupervised ..."
    },
    {
      "id": "ai-ml-4",
      "courseId": "ai-res-3",
      "videoIndex": 4,
      "title": "Batch Machine Learning | Offline Vs Online Learning | Machine Learning Types",
      "durationTimestamp": "11:28",
      "thumbnailUrl": "https://i.ytimg.com/vi/nPrhFxEuTYU/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=nPrhFxEuTYU",
      "description": "Batch Machine Learning | Offline Vs Online Learning | Machine Learning Types Hi, my name is Nitish Singh and you are welcome to my YouTube channel. In this video, discuss the concept of Batch Machine Learning, we will also discuss Offline Vs Onlin..."
    },
    {
      "id": "ai-ml-5",
      "courseId": "ai-res-3",
      "videoIndex": 5,
      "title": "Online Machine Learning | Online Learning | Online Vs Offline Machine Learning",
      "durationTimestamp": "19:28",
      "thumbnailUrl": "https://i.ytimg.com/vi/3oOipgCbLIk/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=3oOipgCbLIk",
      "description": "Online learning is a common technique used in areas of machine learning where it is computationally infeasible to train over the entire dataset, requiring the need for out-of-core algorithms. It is also used in situations where it is necessary for..."
    },
    {
      "id": "ai-ml-6",
      "courseId": "ai-res-3",
      "videoIndex": 6,
      "title": "Instance-Based Vs Model-Based Learning | Types of Machine Learning",
      "durationTimestamp": "16:44",
      "thumbnailUrl": "https://i.ytimg.com/vi/ntAOq1ioTKo/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ntAOq1ioTKo",
      "description": "The Machine Learning systems which are categorized as instance-based learning are the systems that learn the training examples by heart and then generalize to new instances based on some similarity measure. It is called instance-based because it b..."
    },
    {
      "id": "ai-ml-7",
      "courseId": "ai-res-3",
      "videoIndex": 7,
      "title": "Challenges in Machine Learning | Problems in Machine Learning",
      "durationTimestamp": "23:40",
      "thumbnailUrl": "https://i.ytimg.com/vi/WGUNAJki2S4/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=WGUNAJki2S4",
      "description": "Machine Learning or ML is one of the most successful applications of Artificial intelligence which provides systems with automated learning without being constantly programmed. It has acquired a ton of noticeable quality lately due to its capacity..."
    },
    {
      "id": "ai-ml-8",
      "courseId": "ai-res-3",
      "videoIndex": 8,
      "title": "Application of Machine Learning | Real Life Machine Learning Applications",
      "durationTimestamp": "29:02",
      "thumbnailUrl": "https://i.ytimg.com/vi/UZio8TcTMrI/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=UZio8TcTMrI",
      "description": "In this video, we will discuss the wide range of applications of Machine Learning in different fields. Machine learning is the latest buzzword sweeping across the global business landscape. It\u2019s captured the popular imagination, conjuring up visio..."
    },
    {
      "id": "ai-ml-9",
      "courseId": "ai-res-3",
      "videoIndex": 9,
      "title": "Machine Learning Development Life Cycle | MLDLC in Data Science",
      "durationTimestamp": "25:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/iDbhQGz_rEo/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=iDbhQGz_rEo",
      "description": "Machine learning has given computer systems the ability to automatically learn without being explicitly programmed. But how does a machine learning system work? So, it can be described using the life cycle of machine learning. Machine learning lif..."
    },
    {
      "id": "ai-ml-10",
      "courseId": "ai-res-3",
      "videoIndex": 10,
      "title": "Data Engineer Vs Data Analyst Vs Data Scientist Vs ML Engineer | Data Science Job Roles",
      "durationTimestamp": "26:23",
      "thumbnailUrl": "https://i.ytimg.com/vi/93rKZs0MkgU/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=93rKZs0MkgU",
      "description": "A Data Scientist employs advanced data techniques such as clustering, neural networks, decision trees, and the like for deriving business insights. In this role, you will be the senior-most in a team and should have deep expertise in machine learn..."
    },
    {
      "id": "ai-ml-11",
      "courseId": "ai-res-3",
      "videoIndex": 11,
      "title": "What are Tensors | Tensor In-depth Explanation | Tensor in Machine Learning",
      "durationTimestamp": "41:29",
      "thumbnailUrl": "https://i.ytimg.com/vi/vVhD2EyS41Y/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=vVhD2EyS41Y",
      "description": "A tensor is a generalization of vectors and matrices and is easily understood as a multidimensional array. In the general case, an array of numbers arranged on a regular grid with a variable number of axes is known as a tensor. A vector is a one-d..."
    },
    {
      "id": "ai-ml-12",
      "courseId": "ai-res-3",
      "videoIndex": 12,
      "title": "Installing Anaconda For Data Science | Jupyter Notebook for Machine Learning | Google Colab for ML",
      "durationTimestamp": "37:06",
      "thumbnailUrl": "https://i.ytimg.com/vi/82P5N2m41jE/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=82P5N2m41jE",
      "description": "Anaconda is a distribution of the Python and R programming languages for scientific computing (data science, machine learning applications, large-scale data processing, predictive analytics, etc.), that aims to simplify package management and depl..."
    },
    {
      "id": "ai-ml-13",
      "courseId": "ai-res-3",
      "videoIndex": 13,
      "title": "End to End Toy Project | Day 13 | 100 Days of Machine Learning",
      "durationTimestamp": "30:43",
      "thumbnailUrl": "https://i.ytimg.com/vi/dr7z7a_8lQw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=dr7z7a_8lQw",
      "description": "In this video, we will cover an End to End Project on we would apply classification. Share your thoughts, experiences, or questions in the comments below. I love hearing from you! Code used: https://github.com/campusx-official/placement-project-lo..."
    },
    {
      "id": "ai-ml-14",
      "courseId": "ai-res-3",
      "videoIndex": 14,
      "title": "How to Frame a Machine Learning Problem | How to plan a Data Science Project Effectively",
      "durationTimestamp": "22:22",
      "thumbnailUrl": "https://i.ytimg.com/vi/A9SezQlvakw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=A9SezQlvakw",
      "description": "Choosing a machine learning method to implement data is not the easiest of processes. It is essential to first understand the precise business problem and its objectives. For instance, understanding what needs to be predicted and understanding pot..."
    },
    {
      "id": "ai-ml-15",
      "courseId": "ai-res-3",
      "videoIndex": 15,
      "title": "Working with CSV files | Day 15 | 100 Days of Machine Learning",
      "durationTimestamp": "36:30",
      "thumbnailUrl": "https://i.ytimg.com/vi/a_XrmKlaGTs/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=a_XrmKlaGTs",
      "description": "The CSV file format is a popular format supported by many machine learning frameworks. The format is variously referred to \"comma-separated values\" or \"character-separated values.\" A CSV file stores tabular data (numbers and text) in plain text fo..."
    },
    {
      "id": "ai-ml-16",
      "courseId": "ai-res-3",
      "videoIndex": 16,
      "title": "Working with JSON/SQL | Day 16 | 100 Days of Machine Learning",
      "durationTimestamp": "17:00",
      "thumbnailUrl": "https://i.ytimg.com/vi/fFwRC-fapIU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=fFwRC-fapIU",
      "description": "JavaScript Object Notation (JSON) is a standard text-based format for representing structured data based on JavaScript object syntax. JSON is a lightweight data format used for data interchange between multiple different languages. It is easy to r..."
    },
    {
      "id": "ai-ml-17",
      "courseId": "ai-res-3",
      "videoIndex": 17,
      "title": "Fetching Data From an API | Day 17 | 100 Days of Machine Learning",
      "durationTimestamp": "22:50",
      "thumbnailUrl": "https://i.ytimg.com/vi/roTZJaxjnJc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=roTZJaxjnJc",
      "description": "Getting complete and high-performance data is not always the case in Machine Learning. While working on any real-world problem statement or trying to build any sort of project as Machine Learning Practioner you need the data. To accomplish the nee..."
    },
    {
      "id": "ai-ml-18",
      "courseId": "ai-res-3",
      "videoIndex": 18,
      "title": "Fetching data using Web Scraping | Day 18 | 100 Days of Machine Learning",
      "durationTimestamp": "37:49",
      "thumbnailUrl": "https://i.ytimg.com/vi/8NOdgjC1988/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=8NOdgjC1988",
      "description": "Machine learning algorithms are powerful tools for analyzing large amounts of data. Developers who need more training data than they have access to can use a web scraping tool to extract the right kind of information from publicly available websit..."
    },
    {
      "id": "ai-ml-19",
      "courseId": "ai-res-3",
      "videoIndex": 19,
      "title": "Understanding Your Data | Day 19 | 100 Days of Machine Learning",
      "durationTimestamp": "15:23",
      "thumbnailUrl": "https://i.ytimg.com/vi/mJlRTUuVr04/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=mJlRTUuVr04",
      "description": "Quality data is fundamental to any data science engagement. To gain actionable insights, the appropriate data must be sourced and cleansed. Understanding Your Data is the foundational step in any data analysis, involving exploring data characteris..."
    },
    {
      "id": "ai-ml-20",
      "courseId": "ai-res-3",
      "videoIndex": 20,
      "title": "EDA using Univariate Analysis | Day 20 | 100 Days of Machine Learning",
      "durationTimestamp": "30:31",
      "thumbnailUrl": "https://i.ytimg.com/vi/4HyTlbHUKSw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=4HyTlbHUKSw",
      "description": "The preliminary analysis of data to discover relationships between measures in the data and to gain an insight on the trends, patterns, and relationships among various entities present in the data set with the help of statistics and visualization ..."
    },
    {
      "id": "ai-ml-21",
      "courseId": "ai-res-3",
      "videoIndex": 21,
      "title": "EDA using Bivariate and Multivariate Analysis | Day 21 | 100 Days of Machine Learning",
      "durationTimestamp": "38:03",
      "thumbnailUrl": "https://i.ytimg.com/vi/6D3VtEfCw7w/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=6D3VtEfCw7w",
      "description": "Exploratory Data Analysis (EDA) through Bivariate and Multivariate Analysis examines relationships between two or more variables, uncovering patterns and insights in the data. Code used: https://github.com/campusx-official/100-days-of-machine-lear..."
    },
    {
      "id": "ai-ml-22",
      "courseId": "ai-res-3",
      "videoIndex": 22,
      "title": "Pandas Profiling | Day 22 | 100 Days of Machine Learning",
      "durationTimestamp": "13:04",
      "thumbnailUrl": "https://i.ytimg.com/vi/E69Lg2ZgOxg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=E69Lg2ZgOxg",
      "description": "Pandas Profiling is a powerful tool for exploratory data analysis, providing a comprehensive summary and visualization of the dataset using the Pandas library. Code used: https://github.com/campusx-official/100-days-of-machine-learning/tree/main/d..."
    },
    {
      "id": "ai-ml-23",
      "courseId": "ai-res-3",
      "videoIndex": 23,
      "title": "What is Feature Engineering | Day 23 | 100 Days of Machine Learning",
      "durationTimestamp": "24:52",
      "thumbnailUrl": "https://i.ytimg.com/vi/sluoVhT0ehg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=sluoVhT0ehg",
      "description": "Feature Engineering involves creating new features or modifying existing ones to improve a model's performance, helping capture hidden patterns in the data."
    },
    {
      "id": "ai-ml-24",
      "courseId": "ai-res-3",
      "videoIndex": 24,
      "title": "Feature Scaling - Standardization | Day 24 | 100 Days of Machine Learning",
      "durationTimestamp": "32:38",
      "thumbnailUrl": "https://i.ytimg.com/vi/1Yw9sC0PNwY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=1Yw9sC0PNwY",
      "description": "Standardization transforms numerical features to have a mean of 0 and a standard deviation of 1, aiding in comparing and interpreting features with different scales. Code used : https://github.com/campusx-official/100-days-of-machine-learning/tree..."
    },
    {
      "id": "ai-ml-25",
      "courseId": "ai-res-3",
      "videoIndex": 25,
      "title": "Feature Scaling - Normalization | MinMaxScaling | MaxAbsScaling | RobustScaling",
      "durationTimestamp": "23:31",
      "thumbnailUrl": "https://i.ytimg.com/vi/eBrGyuA2MIg/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=eBrGyuA2MIg",
      "description": "Normalization, also known as Min-Max Scaling, is a technique that brings numerical features to a standard scale, preventing certain features from dominating others in the model. Code used: https://github.com/campusx-official/100-days-of-machine-le..."
    },
    {
      "id": "ai-ml-26",
      "courseId": "ai-res-3",
      "videoIndex": 26,
      "title": "Encoding Categorical Data | Ordinal Encoding | Label Encoding",
      "durationTimestamp": "19:53",
      "thumbnailUrl": "https://i.ytimg.com/vi/w2GglmYHfmM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=w2GglmYHfmM",
      "description": "Encoding Categorical Data involves techniques like Ordinal Encoding and Label Encoding, which assign numeric values to categorical variables, facilitating model interpretation. Code used : https://github.com/campusx-official/100-days-of-machine-le..."
    },
    {
      "id": "ai-ml-27",
      "courseId": "ai-res-3",
      "videoIndex": 27,
      "title": "One Hot Encoding | Handling Categorical Data | Day 27 | 100 Days of Machine Learning",
      "durationTimestamp": "30:12",
      "thumbnailUrl": "https://i.ytimg.com/vi/U5oCv3JKWKA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=U5oCv3JKWKA",
      "description": "One Hot Encoding is a method to convert categorical data into a binary matrix, addressing the challenges posed by categorical variables in machine learning models. Code used: https://github.com/campusx-official/100-days-of-machine-learning/tree/ma..."
    },
    {
      "id": "ai-ml-28",
      "courseId": "ai-res-3",
      "videoIndex": 28,
      "title": "Column Transformer in Machine Learning | How to use ColumnTransformer in Sklearn",
      "durationTimestamp": "15:41",
      "thumbnailUrl": "https://i.ytimg.com/vi/5TVj6iEBR4I/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=5TVj6iEBR4I",
      "description": "Column Transformer allows the application of different transformations to different subsets of features, enabling tailored preprocessing for various types of data. Code used : https://github.com/campusx-official/100-days-of-machine-learning/tree/m..."
    },
    {
      "id": "ai-ml-29",
      "courseId": "ai-res-3",
      "videoIndex": 29,
      "title": "Machine Learning Pipelines A-Z | Day 29 | 100 Days of Machine Learning",
      "durationTimestamp": "45:39",
      "thumbnailUrl": "https://i.ytimg.com/vi/xOccYkgRV4Q/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=xOccYkgRV4Q",
      "description": "Machine Learning Pipelines streamline the end-to-end process of model building, evaluation, and deployment, ensuring a systematic and reproducible workflow. Code Used : https://github.com/campusx-official/100-days-of-machine-learning/tree/main/day..."
    },
    {
      "id": "ai-ml-30",
      "courseId": "ai-res-3",
      "videoIndex": 30,
      "title": "Function Transformer | Log Transform | Reciprocal Transform | Square Root Transform",
      "durationTimestamp": "32:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/cTjj3LE8E90/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=cTjj3LE8E90",
      "description": "Function Transformer is a versatile tool for transforming features, with Log and Reciprocal Transforms being useful for handling skewed or non-linear data. Code Used : https://github.com/campusx-official/100-days-of-machine-learning/tree/main/day3..."
    },
    {
      "id": "ai-ml-31",
      "courseId": "ai-res-3",
      "videoIndex": 31,
      "title": "Power Transformer | Box - Cox Transform | Yeo - Johnson Transform",
      "durationTimestamp": "21:28",
      "thumbnailUrl": "https://i.ytimg.com/vi/lV_Z4HbNAx0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=lV_Z4HbNAx0",
      "description": "Power Transformer, including the Box-Cox Transform, is a method used to stabilize and normalize the distribution of data by applying power transformations. Code used : https://github.com/campusx-official/100-days-of-machine-learning/tree/main/day3..."
    },
    {
      "id": "ai-ml-32",
      "courseId": "ai-res-3",
      "videoIndex": 32,
      "title": "Binning and Binarization | Discretization | Quantile Binning | KMeans Binning",
      "durationTimestamp": "38:25",
      "thumbnailUrl": "https://i.ytimg.com/vi/kKWsJGKcMvo/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=kKWsJGKcMvo",
      "description": "Binning involves grouping continuous data into discrete intervals, aiding in feature engineering. Techniques like Quantile Binning divide data based on quantiles, while KMeans Binning uses clustering. Binarization transforms numerical values into ..."
    },
    {
      "id": "ai-ml-33",
      "courseId": "ai-res-3",
      "videoIndex": 33,
      "title": "Handling Mixed Variables | Feature Engineering",
      "durationTimestamp": "12:10",
      "thumbnailUrl": "https://i.ytimg.com/vi/9xiX-I5_LQY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=9xiX-I5_LQY",
      "description": "When dealing with mixed variables (both numerical and categorical) in feature engineering, strategies involve techniques like one-hot encoding for categorical variables and scaling for numerical ones. These methods ensure compatibility and enhance..."
    },
    {
      "id": "ai-ml-34",
      "courseId": "ai-res-3",
      "videoIndex": 34,
      "title": "Handling Date and Time Variables | Day 34 | 100 Days of Machine Learning",
      "durationTimestamp": "14:18",
      "thumbnailUrl": "https://i.ytimg.com/vi/J73mvgG9fFs/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=J73mvgG9fFs",
      "description": "Managing date and time variables is crucial for effective data analysis. Techniques include parsing and extracting components, creating new features, and handling missing values through imputation or interpolation. These practices ensure accurate ..."
    },
    {
      "id": "ai-ml-35",
      "courseId": "ai-res-3",
      "videoIndex": 35,
      "title": "Handling Missing Data | Part 1 | Complete Case Analysis",
      "durationTimestamp": "24:54",
      "thumbnailUrl": "https://i.ytimg.com/vi/aUnNWZorGmk/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=aUnNWZorGmk",
      "description": "Handling missing data is an essential step in the data preprocessing pipeline, ensuring that ML models are trained on high-quality, representative datasets, leading to more accurate and reliable predictions Techniques like imputation, dropping mis..."
    },
    {
      "id": "ai-ml-36",
      "courseId": "ai-res-3",
      "videoIndex": 36,
      "title": "Handling missing data | Numerical Data | Simple Imputer",
      "durationTimestamp": "31:21",
      "thumbnailUrl": "https://i.ytimg.com/vi/mCL2xLBDw8M/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=mCL2xLBDw8M",
      "description": "Simple Imputer is a practical solution for filling missing numerical values in a dataset. This method replaces missing entries with the mean, median, or a specified constant, providing a straightforward approach to address and mitigate the impact ..."
    },
    {
      "id": "ai-ml-37",
      "courseId": "ai-res-3",
      "videoIndex": 37,
      "title": "Handling Missing Categorical Data | Simple Imputer | Most Frequent Imputation | Missing Category Imp",
      "durationTimestamp": "13:34",
      "thumbnailUrl": "https://i.ytimg.com/vi/l_Wip8bEDFQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=l_Wip8bEDFQ",
      "description": "For efficient data preprocessing, Simple Imputer and Most Frequent Imputation are effective techniques. Simple Imputer fills missing categorical values with a specified constant, while Most Frequent Imputation replaces them with the most frequent ..."
    },
    {
      "id": "ai-ml-38",
      "courseId": "ai-res-3",
      "videoIndex": 38,
      "title": "Missing Indicator | Random Sample Imputation | Handling Missing Data Part 4",
      "durationTimestamp": "37:05",
      "thumbnailUrl": "https://i.ytimg.com/vi/Ratcir3p03w/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Ratcir3p03w",
      "description": "The Missing Indicator method involves creating a binary indicator for missing values in a dataset, providing additional information on missing patterns. Random Sample Imputation, on the other hand, fills missing values with random samples from the..."
    },
    {
      "id": "ai-ml-39",
      "courseId": "ai-res-3",
      "videoIndex": 39,
      "title": "KNN Imputer | Multivariate Imputation | Handling Missing Data Part 5",
      "durationTimestamp": "24:27",
      "thumbnailUrl": "https://i.ytimg.com/vi/-fK-xEev2I8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=-fK-xEev2I8",
      "description": "The KNN Imputer is a technique used in multivariate imputation to fill in missing values by considering the values of their k-nearest neighbors. This method leverages similarities between data points to impute missing values effectively, offering ..."
    },
    {
      "id": "ai-ml-40",
      "courseId": "ai-res-3",
      "videoIndex": 40,
      "title": "Multivariate Imputation by Chained Equations for Missing Value | MICE Algorithm | Iterative Imputer",
      "durationTimestamp": "18:31",
      "thumbnailUrl": "https://i.ytimg.com/vi/a38ehxv3kyk/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=a38ehxv3kyk",
      "description": "Multivariate Imputation by Chained Equations (MICE) is a method for handling missing values in a dataset. It imputes missing values by modeling each variable with missing data as a function of other variables. This iterative process continues unti..."
    },
    {
      "id": "ai-ml-41",
      "courseId": "ai-res-3",
      "videoIndex": 41,
      "title": "What are Outliers | Outliers in Machine Learning",
      "durationTimestamp": "17:07",
      "thumbnailUrl": "https://i.ytimg.com/vi/Lln1PKgGr_M/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Lln1PKgGr_M",
      "description": "Outliers are data points significantly different from the majority in a dataset. In machine learning, outliers can impact model performance by skewing results or introducing noise. Identifying and handling outliers is crucial for building accurate..."
    },
    {
      "id": "ai-ml-42",
      "courseId": "ai-res-3",
      "videoIndex": 42,
      "title": "Outlier Detection and Removal using Z-score Method | Handling Outliers Part 2",
      "durationTimestamp": "17:46",
      "thumbnailUrl": "https://i.ytimg.com/vi/OnPE-Z8jtqM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=OnPE-Z8jtqM",
      "description": "The Z-score method identifies outliers by measuring how far each data point is from the mean in terms of standard deviations. Points beyond a certain Z-score threshold are considered outliers. By applying this method, we can effectively detect and..."
    },
    {
      "id": "ai-ml-43",
      "courseId": "ai-res-3",
      "videoIndex": 43,
      "title": "Outlier Detection and Removal using the IQR Method | Handing Outliers Part 3",
      "durationTimestamp": "14:05",
      "thumbnailUrl": "https://i.ytimg.com/vi/Ccv1-W5ilak/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Ccv1-W5ilak",
      "description": "This video focuses on using the IQR (Interquartile Range) method, providing a simple approach to detect and remove outliers. Master the art of data cleaning with this practical tutorial. Code Used : https://github.com/campusx-official/100-days-of-..."
    },
    {
      "id": "ai-ml-44",
      "courseId": "ai-res-3",
      "videoIndex": 44,
      "title": "Outlier Detection using the Percentile Method | Winsorization Technique",
      "durationTimestamp": "16:23",
      "thumbnailUrl": "https://i.ytimg.com/vi/bcXA4CqRXvM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=bcXA4CqRXvM",
      "description": "This video introduces the Winsorization technique, a practical approach to handle outliers. Learn how to enhance the robustness of your data analysis by addressing outliers effectively. Code used : https://github.com/campusx-official/100-days-of-m..."
    },
    {
      "id": "ai-ml-45",
      "courseId": "ai-res-3",
      "videoIndex": 45,
      "title": "Feature Construction | Feature Splitting",
      "durationTimestamp": "12:22",
      "thumbnailUrl": "https://i.ytimg.com/vi/ma-h30PoFms/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ma-h30PoFms",
      "description": "Explore the world of feature manipulation in this video. Learn about feature construction and specifically, feature splitting techniques. Discover how breaking down and reshaping features can enhance your data for better machine learning model per..."
    },
    {
      "id": "ai-ml-46",
      "courseId": "ai-res-3",
      "videoIndex": 46,
      "title": "Curse of Dimensionality",
      "durationTimestamp": "15:25",
      "thumbnailUrl": "https://i.ytimg.com/vi/ToGuhynu-No/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ToGuhynu-No",
      "description": "Understand the 'curse of dimensionality' and its impact on machine learning. Simplifying complex concepts, we explore how handling a large number of dimensions affects your data analysis and model performance."
    },
    {
      "id": "ai-ml-47",
      "courseId": "ai-res-3",
      "videoIndex": 47,
      "title": "Principle Component Analysis  (PCA) | Part 1 | Geometric Intuition",
      "durationTimestamp": "33:54",
      "thumbnailUrl": "https://i.ytimg.com/vi/iRbsBi5W0-c/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=iRbsBi5W0-c",
      "description": "This video focuses on providing a clear geometric intuition behind PCA. Learn the basics and set the foundation for understanding how PCA works in simplifying and preserving important information in your data."
    },
    {
      "id": "ai-ml-48",
      "courseId": "ai-res-3",
      "videoIndex": 48,
      "title": "Principle Component Analysis (PCA) | Part 2 | Problem Formulation and Step by Step Solution",
      "durationTimestamp": "56:17",
      "thumbnailUrl": "https://i.ytimg.com/vi/tXXnxjj2wM4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=tXXnxjj2wM4",
      "description": "This video breaks down the problem formulation and offers a step-by-step solution guide. Enhance your understanding of PCA and master the techniques for dimensionality reduction in your data. Code used: https://github.com/campusx-official/100-days..."
    },
    {
      "id": "ai-ml-49",
      "courseId": "ai-res-3",
      "videoIndex": 49,
      "title": "Principle Component Analysis(PCA) | Part 3 | Code Example and Visualization",
      "durationTimestamp": "43:26",
      "thumbnailUrl": "https://i.ytimg.com/vi/tofVCUDrg4M/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=tofVCUDrg4M",
      "description": "In this video, we provide a code example and visualization to showcase how to implement PCA in Python. Follow along and see the power of PCA in action, simplifying data and enhancing visualization for better insights. Code used: https://github.com..."
    },
    {
      "id": "ai-ml-50",
      "courseId": "ai-res-3",
      "videoIndex": 50,
      "title": "Simple Linear Regression | Code + Intuition | Simplest Explanation in Hindi",
      "durationTimestamp": "33:36",
      "thumbnailUrl": "https://i.ytimg.com/vi/UZPfbG0jNec/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=UZPfbG0jNec",
      "description": "Get a grasp of Simple Linear Regression in this video that combines both code and intuition. We simplify the concepts and guide you through the code implementation, making it easy to understand how this fundamental regression technique works. Code..."
    },
    {
      "id": "ai-ml-51",
      "courseId": "ai-res-3",
      "videoIndex": 51,
      "title": "Simple Linear Regression | Mathematical Formulation | Coding from Scratch",
      "durationTimestamp": "53:31",
      "thumbnailUrl": "https://i.ytimg.com/vi/dXHIDLPKdmA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=dXHIDLPKdmA",
      "description": "In this video, we break down the formula and guide you through coding from scratch in Python. Watch, learn, and build a solid understanding of this foundational regression technique. Code used: https://github.com/campusx-official/100-days-of-machi..."
    },
    {
      "id": "ai-ml-52",
      "courseId": "ai-res-3",
      "videoIndex": 52,
      "title": "Regression Metrics | MSE, MAE & RMSE | R2 Score & Adjusted R2 Score",
      "durationTimestamp": "43:56",
      "thumbnailUrl": "https://i.ytimg.com/vi/Ti7c-Hz7GSM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Ti7c-Hz7GSM",
      "description": "Understand key metrics for evaluating regression models in this video. We cover Mean Squared Error (MSE), Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), R2 Score, and Adjusted R2 Score. Learn how these metrics help assess the accuracy ..."
    },
    {
      "id": "ai-ml-53",
      "courseId": "ai-res-3",
      "videoIndex": 53,
      "title": "Multiple Linear Regression | Geometric Intuition & Code",
      "durationTimestamp": "20:57",
      "thumbnailUrl": "https://i.ytimg.com/vi/ashGekqstl8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ashGekqstl8",
      "description": "This video simplifies the concepts, providing a clear understanding of how to implement Multiple Linear Regression in Python. Enhance your regression skills with this hands-on tutorial. Code used: https://github.com/campusx-official/100-days-of-ma..."
    },
    {
      "id": "ai-ml-54",
      "courseId": "ai-res-3",
      "videoIndex": 54,
      "title": "Multiple Linear Regression | Part 2 | Mathematical Formulation From Scratch",
      "durationTimestamp": "48:11",
      "thumbnailUrl": "https://i.ytimg.com/vi/NU37mF5q8VE/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=NU37mF5q8VE",
      "description": "Dive into the mathematical foundation of Multiple Linear Regression in this second part of our series. We'll guide you through the formulation from scratch, making it easy to grasp the concepts behind this powerful regression technique. Build a so..."
    },
    {
      "id": "ai-ml-55",
      "courseId": "ai-res-3",
      "videoIndex": 55,
      "title": "Multiple Linear Regression | Part 3 | Code From Scratch",
      "durationTimestamp": "16:01",
      "thumbnailUrl": "https://i.ytimg.com/vi/VmZWXzxmNrE/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=VmZWXzxmNrE",
      "description": "Dive into the mathematical foundation of Multiple Linear Regression in this third part of our series. We'll guide you through the formulation from scratch, making it easy to grasp the concepts behind this powerful regression technique. Build a sol..."
    },
    {
      "id": "ai-ml-56",
      "courseId": "ai-res-3",
      "videoIndex": 56,
      "title": "What are the main Assumptions of Linear Regression? | Top 5 Assumptions of Linear Regression",
      "durationTimestamp": "17:38",
      "thumbnailUrl": "https://i.ytimg.com/vi/EmSNAtcHLm8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=EmSNAtcHLm8",
      "description": "In this video, we will discuss the assumptions of linear regression in detail. We will first discuss all the assumptions in theory, and then write python code to check it.  We'll explore the key assumptions that underlie Linear Regression. \ud83e\uddd1\u200d\ud83d\udcbbCode..."
    },
    {
      "id": "ai-ml-57",
      "courseId": "ai-res-3",
      "videoIndex": 57,
      "title": "Gradient Descent From Scratch | End to End Gradient Descent | Gradient Descent Animation",
      "durationTimestamp": "1:57:56",
      "thumbnailUrl": "https://i.ytimg.com/vi/ORyfPJypKuU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ORyfPJypKuU",
      "description": "This is a comprehensive guide to understanding Gradient Descent. We'll cover the entire process from scratch, providing an end-to-end view. Plus, witness a visual representation with a Gradient Descent animation. Code used: https://github.com/camp..."
    },
    {
      "id": "ai-ml-58",
      "courseId": "ai-res-3",
      "videoIndex": 58,
      "title": "Batch Gradient Descent with Code Demo | Simple Explanation in Hindi",
      "durationTimestamp": "1:04:49",
      "thumbnailUrl": "https://i.ytimg.com/vi/Jyo53pAyVAM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Jyo53pAyVAM",
      "description": "Learn the fundamentals of Batch Gradient Descent in this video. We break down the concept into simple terms, providing a clear understanding of how this optimization algorithm works. Code : https://github.com/campusx-official/100-days-of-machine-l..."
    },
    {
      "id": "ai-ml-59",
      "courseId": "ai-res-3",
      "videoIndex": 59,
      "title": "Stochastic Gradient Descent",
      "durationTimestamp": "49:35",
      "thumbnailUrl": "https://i.ytimg.com/vi/V7KBAa_gh4c/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=V7KBAa_gh4c",
      "description": "Stochastic Gradient Descent: Simplify the concept of Stochastic Gradient Descent in this video. We'll break down the fundamentals in easy terms, giving you a clear understanding of how this optimization algorithm works. Code used : https://github...."
    },
    {
      "id": "ai-ml-60",
      "courseId": "ai-res-3",
      "videoIndex": 60,
      "title": "Mini-Batch Gradient Descent",
      "durationTimestamp": "22:10",
      "thumbnailUrl": "https://i.ytimg.com/vi/_scscQ4HVTY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=_scscQ4HVTY",
      "description": "Understand the essentials of Mini-Batch Gradient Descent with simplicity. This video breaks down the basics, providing a clear overview of how this optimization algorithm works. Code used : https://github.com/campusx-official/100-days-of-machine-l..."
    },
    {
      "id": "ai-ml-61",
      "courseId": "ai-res-3",
      "videoIndex": 61,
      "title": "Polynomial Regression | Machine Learning",
      "durationTimestamp": "26:46",
      "thumbnailUrl": "https://i.ytimg.com/vi/BNWLf3cKdbQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=BNWLf3cKdbQ",
      "description": "We simplify the concept, making it easy to understand how polynomial terms can enhance your regression models. Learn to apply Polynomial Regression in Python and elevate your skills in capturing complex relationships in your data. Code used: https..."
    },
    {
      "id": "ai-ml-62",
      "courseId": "ai-res-3",
      "videoIndex": 62,
      "title": "Bias Variance Trade-off | Overfitting and Underfitting in Machine Learning",
      "durationTimestamp": "8:05",
      "thumbnailUrl": "https://i.ytimg.com/vi/74DU02Fyrhk/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=74DU02Fyrhk",
      "description": "In this video, we will learn about bias variance tradeoff in Machine Learning."
    },
    {
      "id": "ai-ml-63",
      "courseId": "ai-res-3",
      "videoIndex": 63,
      "title": "Ridge Regression Part 1 | Geometric Intuition and Code | Regularized Linear Models",
      "durationTimestamp": "19:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/aEow1QoTLo0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=aEow1QoTLo0",
      "description": "Dive into the fundamentals of Ridge Regression with the first part of our series. We'll provide a clear geometric intuition, backed by practical code examples. Explore how Ridge Regression, a form of regularized linear models, can enhance your und..."
    },
    {
      "id": "ai-ml-64",
      "courseId": "ai-res-3",
      "videoIndex": 64,
      "title": "Ridge Regression Part 2 | Mathematical Formulation & Code from scratch | Regularized Linear Models",
      "durationTimestamp": "43:41",
      "thumbnailUrl": "https://i.ytimg.com/vi/oDlZBQjk_3A/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=oDlZBQjk_3A",
      "description": "In the second part of our series, we break down the mathematical formulation of Ridge Regression and guide you through coding it from scratch. Explore the essence of Ridge Regression, a form of regularized linear models, and gain hands-on experien..."
    },
    {
      "id": "ai-ml-65",
      "courseId": "ai-res-3",
      "videoIndex": 65,
      "title": "Ridge Regression Part 3 | Gradient Descent | Regularized Linear Models",
      "durationTimestamp": "18:43",
      "thumbnailUrl": "https://i.ytimg.com/vi/Fci_wwMp8G8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Fci_wwMp8G8",
      "description": "In the third installment of our series, we delve into Ridge Regression with a focus on Gradient Descent. Explore how this optimization technique plays a crucial role in implementing Ridge Regression, a powerful form of regularized linear models. C..."
    },
    {
      "id": "ai-ml-66",
      "courseId": "ai-res-3",
      "videoIndex": 66,
      "title": "5 Key Points - Ridge Regression | Part 4 | Regularized Linear Models",
      "durationTimestamp": "30:17",
      "thumbnailUrl": "https://i.ytimg.com/vi/8osKeShYVRQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=8osKeShYVRQ",
      "description": "In the final part of our Ridge Regression series we highlight 5 key points to solidify your understanding. Explore the essential takeaways that encapsulate the power and benefits of Ridge Regression, a valuable tool in the realm of regularized lin..."
    },
    {
      "id": "ai-ml-67",
      "courseId": "ai-res-3",
      "videoIndex": 67,
      "title": "Lasso Regression | Intuition and Code Sample | Regularized Linear Models",
      "durationTimestamp": "28:37",
      "thumbnailUrl": "https://i.ytimg.com/vi/HLF4bFbBgwk/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=HLF4bFbBgwk",
      "description": "Learn Lasso Regression with this video, offering both intuitive insights and a practical code sample. Understand the key concepts behind Lasso Regression, a form of regularized linear models, and learn how to implement it in Python. Enhance your s..."
    },
    {
      "id": "ai-ml-68",
      "courseId": "ai-res-3",
      "videoIndex": 68,
      "title": "Why Lasso Regression creates sparsity?",
      "durationTimestamp": "24:30",
      "thumbnailUrl": "https://i.ytimg.com/vi/FN4aZPIAfI4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=FN4aZPIAfI4",
      "description": "Ever wondered why Lasso Regression tends to create sparsity in your data? Join us in this exploration where we understand the concept in detail."
    },
    {
      "id": "ai-ml-69",
      "courseId": "ai-res-3",
      "videoIndex": 69,
      "title": "ElasticNet Regression | Intuition and Code Example | Regularized Linear Models",
      "durationTimestamp": "11:41",
      "thumbnailUrl": "https://i.ytimg.com/vi/2g2DBkFhTTY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=2g2DBkFhTTY",
      "description": "Explore the versatility of ElasticNet Regression in this video, blending intuitive insights with a practical code example. Learn why ElasticNet combines the strengths of Lasso and Ridge Regression and how to implement it in Python. Code used: http..."
    },
    {
      "id": "ai-ml-70",
      "courseId": "ai-res-3",
      "videoIndex": 70,
      "title": "Logistic Regression Part 1 | Perceptron Trick",
      "durationTimestamp": "47:06",
      "thumbnailUrl": "https://i.ytimg.com/vi/XNXzVfItWGY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=XNXzVfItWGY",
      "description": "This is the first part of Logistic Regression. We'll kick things off by introducing the Perceptron Trick, a foundational concept that sets the stage for understanding how Logistic Regression works."
    },
    {
      "id": "ai-ml-71",
      "courseId": "ai-res-3",
      "videoIndex": 71,
      "title": "Logistic Regression Part 2 | Perceptron Trick Code",
      "durationTimestamp": "17:07",
      "thumbnailUrl": "https://i.ytimg.com/vi/tLezwPKvPK4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=tLezwPKvPK4",
      "description": "This is the second part of Logistic Regression. Follow the video until the end to understand the concept in detail. Code - https://github.com/campusx-official/100-days-of-machine-learning/tree/main/day58-logistic-regression"
    },
    {
      "id": "ai-ml-72",
      "courseId": "ai-res-3",
      "videoIndex": 72,
      "title": "Logistic Regression Part 3 | Sigmoid Function | 100 Days of ML",
      "durationTimestamp": "40:44",
      "thumbnailUrl": "https://i.ytimg.com/vi/ehO0-6i9qD4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ehO0-6i9qD4",
      "description": "Explore the essential Sigmoid Function in the context of Logistic Regression. In this video, we'll break down the role and significance of the Sigmoid function, shedding light on how it transforms input into probabilities. Code used: https://githu..."
    },
    {
      "id": "ai-ml-73",
      "courseId": "ai-res-3",
      "videoIndex": 73,
      "title": "Logistic Regression Part 4 | Loss Function | Maximum Likelihood | Binary Cross Entropy",
      "durationTimestamp": "29:03",
      "thumbnailUrl": "https://i.ytimg.com/vi/6bXOo0sxY5c/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=6bXOo0sxY5c",
      "description": "In this video, we'll explore the loss function, focusing on Maximum Likelihood and Binary Cross Entropy."
    },
    {
      "id": "ai-ml-74",
      "courseId": "ai-res-3",
      "videoIndex": 74,
      "title": "Derivative of Sigmoid Function",
      "durationTimestamp": "5:57",
      "thumbnailUrl": "https://i.ytimg.com/vi/awjXaFR1jOM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=awjXaFR1jOM",
      "description": "In this video, we'll simplify the mathematics, making it easy to understand how to calculate the derivative of the Sigmoid function."
    },
    {
      "id": "ai-ml-75",
      "courseId": "ai-res-3",
      "videoIndex": 75,
      "title": "Logistic Regression Part 5 | Gradient Descent & Code From Scratch",
      "durationTimestamp": "36:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/ABrrSwMYWSg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ABrrSwMYWSg",
      "description": "In this video, we'll explore Gradient Descent and guide you through coding Logistic Regression from scratch. Join us on this hands-on journey to implement and understand the core optimization technique for Logistic Regression models Code : https:/..."
    },
    {
      "id": "ai-ml-76",
      "courseId": "ai-res-3",
      "videoIndex": 76,
      "title": "Accuracy and Confusion Matrix | Type 1 and Type 2 Errors | Classification Metrics Part 1",
      "durationTimestamp": "34:08",
      "thumbnailUrl": "https://i.ytimg.com/vi/c09drtuCS3c/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=c09drtuCS3c",
      "description": "In this video. we'll explore accuracy and the confusion matrix, unraveling the concepts of Type 1 and Type 2 errors. Join us on this journey to understand how these metrics play a crucial role in evaluating the performance of classification models..."
    },
    {
      "id": "ai-ml-77",
      "courseId": "ai-res-3",
      "videoIndex": 77,
      "title": "Precision, Recall and F1 Score | Classification Metrics Part 2",
      "durationTimestamp": "42:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/iK-kdhJ-7yI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=iK-kdhJ-7yI",
      "description": "Precision, Recall, and F1 Score | Classification Metrics Part 2: Explore advanced classification metrics in this video. We'll delve into precision, recall, and the F1 score, providing insights into their roles in assessing model performance. Code ..."
    },
    {
      "id": "ai-ml-78",
      "courseId": "ai-res-3",
      "videoIndex": 78,
      "title": "ROC Curve in Machine Learning | ROC-AUC in Machine Learning Simplified | CampusX",
      "durationTimestamp": "1:11:15",
      "thumbnailUrl": "https://i.ytimg.com/vi/gdW6hj9IXaA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=gdW6hj9IXaA",
      "description": "Curious about ROC Curve and ROC-AUC in machine learning but finding it confusing? This video is here to simplify these concepts for you. \ud83d\udca1 Why It Matters in ML: ROC Curve and ROC-AUC are like a report card for our machine learning models, showing ..."
    },
    {
      "id": "ai-ml-79",
      "courseId": "ai-res-3",
      "videoIndex": 79,
      "title": "Softmax Regression || Multinomial Logistic Regression || Logistic Regression Part 6",
      "durationTimestamp": "38:21",
      "thumbnailUrl": "https://i.ytimg.com/vi/Z8noL_0M4tw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Z8noL_0M4tw",
      "description": "Softmax Regression, also known as Multinomial Logistic Regression, is an extension of logistic regression to handle multiple classes. It computes the probabilities of each class and selects the one with the highest probability as the predicted cla..."
    },
    {
      "id": "ai-ml-80",
      "courseId": "ai-res-3",
      "videoIndex": 80,
      "title": "Polynomial Features in Logistic Regression | Non Linear Logistic Regression | Logistic Regression 7",
      "durationTimestamp": "9:11",
      "thumbnailUrl": "https://i.ytimg.com/vi/WnBYW_DX3sM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=WnBYW_DX3sM",
      "description": "In logistic regression, polynomial features involve transforming the input features into higher-degree polynomials. This helps capture more complex relationships between variables, potentially improving the model's ability to fit non-linear patter..."
    },
    {
      "id": "ai-ml-81",
      "courseId": "ai-res-3",
      "videoIndex": 81,
      "title": "Logistic Regression Hyperparameters || Logistic Regression Part 8",
      "durationTimestamp": "13:07",
      "thumbnailUrl": "https://i.ytimg.com/vi/ay_OcblJasE/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ay_OcblJasE",
      "description": "Logistic Regression hyperparameters are parameters that are set before the training process and influence the model's performance. Key hyperparameters include 'C' for regularization strength, 'solver' for optimization algorithm, and 'max_iter' for..."
    },
    {
      "id": "ai-ml-82",
      "courseId": "ai-res-3",
      "videoIndex": 82,
      "title": "Naive Bayes Classifier | Part 1 | Conditional Probability",
      "durationTimestamp": "9:26",
      "thumbnailUrl": "https://i.ytimg.com/vi/Ty7knppVo9E/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Ty7knppVo9E",
      "description": "In this video, we will learn the concept of conditional probability About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to students in the latest cutting - edge technologies like Mach..."
    },
    {
      "id": "ai-ml-83",
      "courseId": "ai-res-3",
      "videoIndex": 83,
      "title": "Naive Bayes Classifier | Part 2 | Independent Events in Probability",
      "durationTimestamp": "7:59",
      "thumbnailUrl": "https://i.ytimg.com/vi/0GD480CnrO4/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=0GD480CnrO4",
      "description": "In this video, we will learn about independent events in probability About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to students in the latest cutting - edge technologies like Mac..."
    },
    {
      "id": "ai-ml-84",
      "courseId": "ai-res-3",
      "videoIndex": 84,
      "title": "Naive Bayes Classifier | Part 3 | Mutually Exclusive Events",
      "durationTimestamp": "1:49",
      "thumbnailUrl": "https://i.ytimg.com/vi/nneTjTYikBE/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=nneTjTYikBE",
      "description": "In this video, we will learn about Mutually Exclusive Events in Probability About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to students in the latest cutting - edge technologies l..."
    },
    {
      "id": "ai-ml-85",
      "courseId": "ai-res-3",
      "videoIndex": 85,
      "title": "Naive Bayes Classifier | Part 4 | Bayes Theorem in Probability",
      "durationTimestamp": "4:27",
      "thumbnailUrl": "https://i.ytimg.com/vi/Oqw-v-Z7PuU/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Oqw-v-Z7PuU",
      "description": "In this video, we will learn Bayes theorem About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to students in the latest cutting - edge technologies like Machine Learning, Python, Web..."
    },
    {
      "id": "ai-ml-86",
      "courseId": "ai-res-3",
      "videoIndex": 86,
      "title": "Naive Bayes Classifier | Part 5 | Problem based upon Bayes Theorem",
      "durationTimestamp": "9:00",
      "thumbnailUrl": "https://i.ytimg.com/vi/aAEHjXDHtbE/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=aAEHjXDHtbE",
      "description": "In this video, we will tackle a problem based on Bayes Theorem About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to students in the latest cutting - edge technologies like Machine L..."
    },
    {
      "id": "ai-ml-87",
      "courseId": "ai-res-3",
      "videoIndex": 87,
      "title": "Naive Bayes Classifier | Part 6 | Intuition",
      "durationTimestamp": "14:44",
      "thumbnailUrl": "https://i.ytimg.com/vi/ZR1_QtLk_4U/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ZR1_QtLk_4U",
      "description": "In this video, we will learn about the basic fundamental logic of Naive Bayes algorithm About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to students in the latest cutting - edge te..."
    },
    {
      "id": "ai-ml-88",
      "courseId": "ai-res-3",
      "videoIndex": 88,
      "title": "Naive Bayes Classifier | Part 7 | Mathematics behind Naive Bayes Algorithm",
      "durationTimestamp": "19:09",
      "thumbnailUrl": "https://i.ytimg.com/vi/2PVRG45eVrY/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=2PVRG45eVrY",
      "description": "In this video, we will derive the formula for Naive Bayes algorithm About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to students in the latest cutting - edge technologies like Mach..."
    },
    {
      "id": "ai-ml-89",
      "courseId": "ai-res-3",
      "videoIndex": 89,
      "title": "Naive Bayes Classifier | Part 8 | Simple Example Code",
      "durationTimestamp": "16:03",
      "thumbnailUrl": "https://i.ytimg.com/vi/DeeWsqoY4Eo/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=DeeWsqoY4Eo",
      "description": "In this video, we will write a simple code on a toy dataset Dataset used: https://www.kaggle.com/fredericobreno/play-tennis About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to stud..."
    },
    {
      "id": "ai-ml-90",
      "courseId": "ai-res-3",
      "videoIndex": 90,
      "title": "Naive Bayes Part 9 | Handling Numerical Data",
      "durationTimestamp": "8:47",
      "thumbnailUrl": "https://i.ytimg.com/vi/TCgK2nBJx9o/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=TCgK2nBJx9o",
      "description": "In this video, we will learn how the Naive Bayes handles Numerical data. About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to students in the latest cutting - edge technologies like..."
    },
    {
      "id": "ai-ml-91",
      "courseId": "ai-res-3",
      "videoIndex": 91,
      "title": "What is K Nearest Neighbors? | KNN Explained in Hindi | Simple Overview in 1 Video | CampusX",
      "durationTimestamp": "52:01",
      "thumbnailUrl": "https://i.ytimg.com/vi/abnL_GUGub4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=abnL_GUGub4",
      "description": "Curious about K Nearest Neighbors (KNN) in the world of machine learning? This video is your easy-to-follow guide, breaking down KNN without the techy jargon. \ud83c\udf1f Basic Concept: Imagine finding friends in your neighborhood; KNN works kind of like th..."
    },
    {
      "id": "ai-ml-92",
      "courseId": "ai-res-3",
      "videoIndex": 92,
      "title": "Support Vector Machines | Geometric Intuition",
      "durationTimestamp": "11:46",
      "thumbnailUrl": "https://i.ytimg.com/vi/ugTxMLjLS8M/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ugTxMLjLS8M",
      "description": "Like my content? Consider supporting the channel. The link is provided below- https://campusx.mojo.page/support-campusx"
    },
    {
      "id": "ai-ml-93",
      "courseId": "ai-res-3",
      "videoIndex": 93,
      "title": "Mathematics of SVM | Support Vector Machines | Hard margin SVM",
      "durationTimestamp": "34:54",
      "thumbnailUrl": "https://i.ytimg.com/vi/yCAlHPDgWtM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=yCAlHPDgWtM",
      "description": "Created by InShot:https://inshotapp.com/share/youtube.html"
    },
    {
      "id": "ai-ml-94",
      "courseId": "ai-res-3",
      "videoIndex": 94,
      "title": "Mathematics of Support Vector Machine | Soft Margin SVM",
      "durationTimestamp": "14:38",
      "thumbnailUrl": "https://i.ytimg.com/vi/utqrvIFAE1k/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=utqrvIFAE1k",
      "description": "Like my content? Consider supporting the channel. The link is provided below- https://campusx.mojo.page/support-campusx"
    },
    {
      "id": "ai-ml-95",
      "courseId": "ai-res-3",
      "videoIndex": 95,
      "title": "Kernel Trick in SVM | Geometric Intuition",
      "durationTimestamp": "6:18",
      "thumbnailUrl": "https://i.ytimg.com/vi/egxjT0p7_K8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=egxjT0p7_K8",
      "description": "Like my content? Consider supporting the channel. The link is provided below- https://campusx.mojo.page/support-campusx"
    },
    {
      "id": "ai-ml-96",
      "courseId": "ai-res-3",
      "videoIndex": 96,
      "title": "Kernel Trick in SVM | Code Example",
      "durationTimestamp": "14:04",
      "thumbnailUrl": "https://i.ytimg.com/vi/pjvmVMDrzVU/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=pjvmVMDrzVU",
      "description": "Notebook used: https://github.com/campusx-official/Support-Vector-Machines-SVM-/blob/master/Kernel%20Trick%20SVM.ipynb About CampusX: CampusX is an online mentorship program for engineering students. We offer a 6-month long mentorship to students ..."
    },
    {
      "id": "ai-ml-97",
      "courseId": "ai-res-3",
      "videoIndex": 97,
      "title": "Decision Trees Geometric Intuition | Entropy | Gini impurity | Information Gain",
      "durationTimestamp": "58:29",
      "thumbnailUrl": "https://i.ytimg.com/vi/IZnno-dKgVQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=IZnno-dKgVQ",
      "description": "Decision Trees use metrics like Entropy and Gini Impurity to make split decisions. Entropy measures the disorder or randomness in a dataset, while Gini Impurity quantifies the probability of misclassifying a randomly chosen element. Information Ga..."
    },
    {
      "id": "ai-ml-98",
      "courseId": "ai-res-3",
      "videoIndex": 98,
      "title": "Decision Trees - Hyperparameters | Overfitting and Underfitting in Decision Trees",
      "durationTimestamp": "27:23",
      "thumbnailUrl": "https://i.ytimg.com/vi/mDEV0Iucwz0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=mDEV0Iucwz0",
      "description": "In Decision Trees, hyperparameters play a crucial role in managing model complexity. Common hyperparameters include 'max_depth' to control the tree's depth, 'min_samples_split' for the minimum samples required to split a node, and 'min_samples_lea..."
    },
    {
      "id": "ai-ml-99",
      "courseId": "ai-res-3",
      "videoIndex": 99,
      "title": "Regression Trees | Decision Trees Part 3",
      "durationTimestamp": "35:15",
      "thumbnailUrl": "https://i.ytimg.com/vi/RANHxyAvtM4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=RANHxyAvtM4",
      "description": "Regression Trees are a variation of Decision Trees used for predicting continuous numerical values. Instead of class labels, the nodes in a Regression Tree contain predicted values. The tree structure helps capture complex relationships in the dat..."
    },
    {
      "id": "ai-ml-100",
      "courseId": "ai-res-3",
      "videoIndex": 100,
      "title": "Awesome Decision Tree Visualization using dtreeviz library",
      "durationTimestamp": "18:36",
      "thumbnailUrl": "https://i.ytimg.com/vi/SlMZqfvl5uw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=SlMZqfvl5uw",
      "description": "Code used : https://github.com/campusx-official/dtreeviz-demo dtreeViz library : https://explained.ai/decision-tree-viz/index.html"
    },
    {
      "id": "ai-ml-101",
      "courseId": "ai-res-3",
      "videoIndex": 101,
      "title": "Introduction to Ensemble Learning | Ensemble Techniques in Machine Learning",
      "durationTimestamp": "37:43",
      "thumbnailUrl": "https://i.ytimg.com/vi/bHK1fE_BUms/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=bHK1fE_BUms",
      "description": "This video gives you a simple overview of Ensemble Learning and its techniques. Learn how combining multiple models can boost your predictions and improve overall performance in machine learning tasks."
    },
    {
      "id": "ai-ml-102",
      "courseId": "ai-res-3",
      "videoIndex": 102,
      "title": "Voting Ensemble |  Introduction and Core Idea | Part 1",
      "durationTimestamp": "16:30",
      "thumbnailUrl": "https://i.ytimg.com/vi/_W1i-c_6rOk/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=_W1i-c_6rOk",
      "description": "Voting Classifier Playlist: Part 1 - https://www.youtube.com/watch?v=_W1i-c_6rOk Part 2 - https://www.youtube.com/watch?v=pGQnNYdPTvY Part 3 - https://www.youtube.com/watch?v=ut4vh59rGkw"
    },
    {
      "id": "ai-ml-103",
      "courseId": "ai-res-3",
      "videoIndex": 103,
      "title": "Voting Ensemble | Classification | Voting Classifier | Hard Voting Vs Soft Voting | Part 2",
      "durationTimestamp": "23:50",
      "thumbnailUrl": "https://i.ytimg.com/vi/pGQnNYdPTvY/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=pGQnNYdPTvY",
      "description": "In a Voting Ensemble, multiple classifiers are combined to make predictions collectively. The Voting Classifier aggregates the predictions from individual models using either Hard Voting (simple majority) or Soft Voting (weighted average of probab..."
    },
    {
      "id": "ai-ml-104",
      "courseId": "ai-res-3",
      "videoIndex": 104,
      "title": "Voting Ensemble | Regression | Part 3",
      "durationTimestamp": "10:57",
      "thumbnailUrl": "https://i.ytimg.com/vi/ut4vh59rGkw/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ut4vh59rGkw",
      "description": "Code of used : https://github.com/campusx-official/voting-ensemle Voting Classifier Playlist: Part 1 - https://www.youtube.com/watch?v=_W1i-c_6rOk Part 2 - https://www.youtube.com/watch?v=pGQnNYdPTvY Part 3 - https://www.youtube.com/watch?v=ut4vh5..."
    },
    {
      "id": "ai-ml-105",
      "courseId": "ai-res-3",
      "videoIndex": 105,
      "title": "Bagging | Introduction | Part 1",
      "durationTimestamp": "31:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/LUiBOAy7x6Y/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LUiBOAy7x6Y",
      "description": "Bagging, or Bootstrap Aggregating, is an ensemble method that involves training multiple models independently on different subsets of the training data. These models are then combined through averaging or voting to make predictions. Bagging reduce..."
    },
    {
      "id": "ai-ml-106",
      "courseId": "ai-res-3",
      "videoIndex": 106,
      "title": "Bagging Ensemble | Part 2 | Bagging Classifiers",
      "durationTimestamp": "22:32",
      "thumbnailUrl": "https://i.ytimg.com/vi/-1T54G_E-ys/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=-1T54G_E-ys",
      "description": "In this continuation video, we dive deeper into Bagging Classifiers, a key component of Bagging Ensembles. Learn how Bagging Classifiers leverage bootstrap sampling and aggregation to enhance model performance and robustness. Notebook Link : https..."
    },
    {
      "id": "ai-ml-107",
      "courseId": "ai-res-3",
      "videoIndex": 107,
      "title": "Bagging Ensemble | Part 3 | Bagging Regressor",
      "durationTimestamp": "10:55",
      "thumbnailUrl": "https://i.ytimg.com/vi/HYVzrETXbkE/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=HYVzrETXbkE",
      "description": "Code used: https://github.com/campusx-official/bagging-ensemble"
    },
    {
      "id": "ai-ml-108",
      "courseId": "ai-res-3",
      "videoIndex": 108,
      "title": "Introduction to Random Forest | Intuition behind the Algorithm",
      "durationTimestamp": "33:55",
      "thumbnailUrl": "https://i.ytimg.com/vi/F9uESCHGjhA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=F9uESCHGjhA",
      "description": "Get familiar with Random Forest in a straightforward way. This video provides an easy-to-understand intuition behind the algorithm, making it simple for beginners to grasp the basics of Random Forest in machine learning. Code used: https://github...."
    },
    {
      "id": "ai-ml-109",
      "courseId": "ai-res-3",
      "videoIndex": 109,
      "title": "How Random Forest Performs So Well? Bias Variance Trade-Off in Random Forest",
      "durationTimestamp": "12:52",
      "thumbnailUrl": "https://i.ytimg.com/vi/jHgG4gjuFAk/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=jHgG4gjuFAk",
      "description": "Understand the reason behind Random Forest's strong performance. This video explains the concept of Bias-Variance Trade-Off in Random Forest in simple terms, revealing why it's a powerful technique in machine learning. Code used: https://github.co..."
    },
    {
      "id": "ai-ml-110",
      "courseId": "ai-res-3",
      "videoIndex": 110,
      "title": "Bagging Vs Random Forest | What is the difference between Bagging and Random Forest | Very Important",
      "durationTimestamp": "12:02",
      "thumbnailUrl": "https://i.ytimg.com/vi/l93jRojZMqU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=l93jRojZMqU",
      "description": "Bagging Vs Random Forest: Learn the simple differences between Bagging and Random Forest. This video breaks down the two techniques, helping you understand how they work and when to use each. Code Used: https://github.com/campusx-official/100-days..."
    },
    {
      "id": "ai-ml-111",
      "courseId": "ai-res-3",
      "videoIndex": 111,
      "title": "Random Forest Hyper-parameters",
      "durationTimestamp": "15:17",
      "thumbnailUrl": "https://i.ytimg.com/vi/WOFVY_wQ9wU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=WOFVY_wQ9wU",
      "description": "This video explains the important hyperparameters in Random Forest in a straightforward manner, helping you grasp how they impact the model's behavior and effectiveness. Official Documentation: https://scikit-learn.org/stable/modules/generated/skl..."
    },
    {
      "id": "ai-ml-112",
      "courseId": "ai-res-3",
      "videoIndex": 112,
      "title": "Hyperparameter Tuning Random Forest using GridSearchCV and RandomizedSearchCV | Code Example",
      "durationTimestamp": "11:44",
      "thumbnailUrl": "https://i.ytimg.com/vi/4Im0CT43QxY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=4Im0CT43QxY",
      "description": "This video simplifies the process, guiding you through optimizing hyperparameters for better model performance. Code used: https://github.com/campusx-official/100-days-of-machine-learning/tree/main/day65-random-forest"
    },
    {
      "id": "ai-ml-113",
      "courseId": "ai-res-3",
      "videoIndex": 113,
      "title": "OOB Score | Out of Bag Evaluation in Random Forest | Machine Learning",
      "durationTimestamp": "6:45",
      "thumbnailUrl": "https://i.ytimg.com/vi/tdDhyFoSG94/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=tdDhyFoSG94",
      "description": "This video explains how OOB is used to evaluate model performance without separate validation sets. Learn about this insightful technique for assessing your Random Forest models. Code used: https://github.com/campusx-official/100-days-of-machine-l..."
    },
    {
      "id": "ai-ml-114",
      "courseId": "ai-res-3",
      "videoIndex": 114,
      "title": "Feature Importance using Random Forest and Decision Trees | How is Feature Importance calculated",
      "durationTimestamp": "27:20",
      "thumbnailUrl": "https://i.ytimg.com/vi/R47JAob1xBY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=R47JAob1xBY",
      "description": "This video breaks down the process using Random Forest and Decision Trees, making it easy to comprehend. Learn how these techniques help identify the most impactful features in your data. Code: https://github.com/campusx-official/100-days-of-machi..."
    },
    {
      "id": "ai-ml-115",
      "courseId": "ai-res-3",
      "videoIndex": 115,
      "title": "How Adaboost Classifier Works? | Geometric Intuition",
      "durationTimestamp": "17:14",
      "thumbnailUrl": "https://i.ytimg.com/vi/sFKnP0iP0K0/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=sFKnP0iP0K0",
      "description": "In this video, we will explore the geometric intuition behind how the Adaboost classifier works, providing a clear and detailed explanation of its underlying principles."
    },
    {
      "id": "ai-ml-116",
      "courseId": "ai-res-3",
      "videoIndex": 116,
      "title": "AdaBoost - A Step by Step Explanation",
      "durationTimestamp": "19:23",
      "thumbnailUrl": "https://i.ytimg.com/vi/RT0t9a3Xnfw/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=RT0t9a3Xnfw",
      "description": "In this video, we will dive into the concept of AdaBoost and understand how this machine learning algorithm works step by step. From its basic principles to its application in real-world scenarios, we will explore the intricacies of AdaBoost in a ..."
    },
    {
      "id": "ai-ml-117",
      "courseId": "ai-res-3",
      "videoIndex": 117,
      "title": "AdaBoost Algorithm | Code from Scratch",
      "durationTimestamp": "16:27",
      "thumbnailUrl": "https://i.ytimg.com/vi/a20TaKNsriE/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=a20TaKNsriE",
      "description": "his video guides you through building the AdaBoost algorithm step by step in Python. Perfect for beginners looking to understand and implement AdaBoost on their own. Code Used: https://github.com/campusx-official/100-days-of-machine-learning/tree/..."
    },
    {
      "id": "ai-ml-118",
      "courseId": "ai-res-3",
      "videoIndex": 118,
      "title": "AdaBoost Hyperparameters | GridSearchCV in Adaboost",
      "durationTimestamp": "11:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/JmXnztjULnQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=JmXnztjULnQ",
      "description": "AdaBoost Hyperparameters: Learn how to fine-tune AdaBoost using GridSearchCV. This video simplifies the process, showing you step by step how to optimize hyperparameters for better model performance. Code used - https://github.com/campusx-official..."
    },
    {
      "id": "ai-ml-119",
      "courseId": "ai-res-3",
      "videoIndex": 119,
      "title": "Bagging Vs Boosting | What is the difference between Bagging and Boosting",
      "durationTimestamp": "6:17",
      "thumbnailUrl": "https://i.ytimg.com/vi/7M5oWXCpDEw/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=7M5oWXCpDEw",
      "description": "Bagging vs Boosting: Understand the key differences between these two techniques in simple terms. This video breaks down Bagging and Boosting, helping you grasp their distinctions and choose the right approach for your machine learning tasks."
    },
    {
      "id": "ai-ml-120",
      "courseId": "ai-res-3",
      "videoIndex": 120,
      "title": "Gradient Boosting Explained | How Gradient Boosting Works?",
      "durationTimestamp": "32:49",
      "thumbnailUrl": "https://i.ytimg.com/vi/fbKz7N92mhQ/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=fbKz7N92mhQ",
      "description": "In this video, we'll provide a comprehensive explanation of Gradient Boosting, breaking down how the technique works. We'll cover the underlying principles, the iterative boosting process, and the ensemble of weak learners, offering a clear unders..."
    },
    {
      "id": "ai-ml-121",
      "courseId": "ai-res-3",
      "videoIndex": 121,
      "title": "Gradient Boosting Regression Part 2 | Mathematics of Gradient Boosting",
      "durationTimestamp": "56:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/nMNiTZm-qY0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=nMNiTZm-qY0",
      "description": "In this video, we'll dive deeper into Gradient Boosting Regression, specifically focusing on the underlying mathematics of the technique. We'll break down the mathematical concepts and equations that power Gradient Boosting, providing a comprehens..."
    },
    {
      "id": "ai-ml-122",
      "courseId": "ai-res-3",
      "videoIndex": 122,
      "title": "Gradient Boosting for Classification | Geometric Intuition | CampusX",
      "durationTimestamp": "1:04:33",
      "thumbnailUrl": "https://i.ytimg.com/vi/4p5EQtyxSyI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=4p5EQtyxSyI",
      "description": "In this video, we talk about Gradient boosting for classification. Watch the video till the end to understand the concept in detail. \ud83d\udd17Resources: Blog Link - https://towardsdatascience.com/all-you-need-to-know-about-gradient-boosting-algorithm-part..."
    },
    {
      "id": "ai-ml-123",
      "courseId": "ai-res-3",
      "videoIndex": 123,
      "title": "Introduction to XGBOOST | Machine Learning | CampusX",
      "durationTimestamp": "1:19:37",
      "thumbnailUrl": "https://i.ytimg.com/vi/C6aDw4y8qJ0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=C6aDw4y8qJ0",
      "description": "In this video, we delve into the world of XGBoost, a powerful and versatile machine learning algorithm. Whether you're a data scientist, a machine learning enthusiast, or a curious mind, join us as we unravel the history, features, and performance..."
    },
    {
      "id": "ai-ml-124",
      "courseId": "ai-res-3",
      "videoIndex": 124,
      "title": "XGBoost for Regression | XGBoost Part 2 | CampusX",
      "durationTimestamp": "47:17",
      "thumbnailUrl": "https://i.ytimg.com/vi/gmp2tS2joaA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=gmp2tS2joaA",
      "description": "\ud83d\udd0d Ever wondered how XGBoost works under the hood for regression tasks? \ud83d\ude80 Welcome to *CampusX* !! In this tutorial, we'll unravel the mathematical intricacies of XGBoost for regression, guiding you through each step of the process. Whether you're a..."
    },
    {
      "id": "ai-ml-125",
      "courseId": "ai-res-3",
      "videoIndex": 125,
      "title": "XGBoost For Classification | How XGBoost works on Classification Problems | CampusX",
      "durationTimestamp": "39:08",
      "thumbnailUrl": "https://i.ytimg.com/vi/mELtxVUNNrw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=mELtxVUNNrw",
      "description": "Explore how XGBoost takes on classification problems with precision and efficiency. From its intuitive framework to tackling real-world datasets, this video breaks down the essentials of using XGBoost for classification tasks. In this tutorial, we..."
    },
    {
      "id": "ai-ml-126",
      "courseId": "ai-res-3",
      "videoIndex": 126,
      "title": "The Maths Behind XGBoost | Machine Learning | CampusX",
      "durationTimestamp": "1:57:28",
      "thumbnailUrl": "https://i.ytimg.com/vi/0Eo-_5bfers/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=0Eo-_5bfers",
      "description": "In this tutorial, we unravel the intricate details of XGBoost, from boosting as an additive model to the derivation of the loss function, addressing challenges with the objective function, and introducing the solution using the Taylor Series. Whet..."
    },
    {
      "id": "ai-ml-127",
      "courseId": "ai-res-3",
      "videoIndex": 127,
      "title": "Stacking and Blending Ensembles",
      "durationTimestamp": "35:20",
      "thumbnailUrl": "https://i.ytimg.com/vi/O-aDHBGMqXA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=O-aDHBGMqXA",
      "description": "In this video, we'll try to understand the concepts of stacking and blending ensembles, powerful techniques to enhance model performance in machine learning. We'll explain how combining multiple models strategically can lead to improved prediction..."
    },
    {
      "id": "ai-ml-128",
      "courseId": "ai-res-3",
      "videoIndex": 128,
      "title": "K-Means Clustering Algorithm | Geometric Intuition | Clustering | Unsupervised Learning",
      "durationTimestamp": "23:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/5shTLzwAdEc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=5shTLzwAdEc",
      "description": "In this video, we are going to learn about the K-means clustering algorithm. k-means clustering is a method of vector quantization, originally from signal processing, that aims to partition n observations into k clusters in which each observation ..."
    },
    {
      "id": "ai-ml-129",
      "courseId": "ai-res-3",
      "videoIndex": 129,
      "title": "K-Means Clustering Algorithm in Python | Practical Example | Student Clustering Example | sklearn",
      "durationTimestamp": "10:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/UPvv9SprgVo/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=UPvv9SprgVo",
      "description": "In this video, we will learn how to implement  Kmeans using python Sklearn library. We will use Kmeans to cluster students in a dataset. Join us as we walk you through the practical implementation of the K-Means Clustering algorithm in Python, usi..."
    },
    {
      "id": "ai-ml-130",
      "courseId": "ai-res-3",
      "videoIndex": 130,
      "title": "K-Means Clustering Algorithm From Scratch In Python | ML Algorithms From Scratch",
      "durationTimestamp": "33:53",
      "thumbnailUrl": "https://i.ytimg.com/vi/MFraC1JObUo/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=MFraC1JObUo",
      "description": "In this video, we'll demystify the K-Means Clustering algorithm by implementing it from scratch in Python. Dive deep into the inner workings of K-Means as we build the algorithm step by step. Code: https://github.com/campusx-official/100-days-of-m..."
    },
    {
      "id": "ai-ml-131",
      "courseId": "ai-res-3",
      "videoIndex": 131,
      "title": "Agglomerative Hierarchical Clustering | Python Code Example",
      "durationTimestamp": "37:23",
      "thumbnailUrl": "https://i.ytimg.com/vi/Ka5i9TVUT-E/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Ka5i9TVUT-E",
      "description": "In this video, we'll delve into the concept of Agglomerative Hierarchical Clustering. This technique involves grouping similar data points together in a hierarchical manner, making it easier to understand patterns and relationships within the data..."
    },
    {
      "id": "ai-ml-132",
      "courseId": "ai-res-3",
      "videoIndex": 132,
      "title": "DBSCAN Clustering Algorithms | Density Based Clustering | How DBSCAN Works | CampusX",
      "durationTimestamp": "34:16",
      "thumbnailUrl": "https://i.ytimg.com/vi/1_bLnsNmhCI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=1_bLnsNmhCI",
      "description": "In today's video, we dive deep into the world of clustering with a focus on DBSCAN (Density-Based Spatial Clustering of Applications with Noise). Whether you're a data science enthusiast, a student, or a professional looking to enhance your machin..."
    },
    {
      "id": "ai-ml-133",
      "courseId": "ai-res-3",
      "videoIndex": 133,
      "title": "Imbalanced Data in Machine Learning | Undersampling | Oversampling | SMOTE",
      "durationTimestamp": "57:17",
      "thumbnailUrl": "https://i.ytimg.com/vi/yh2AKoJCV3k/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=yh2AKoJCV3k",
      "description": "Imbalanced data refers to datasets where the distribution of classes is heavily skewed, with one class significantly outnumbering the others. Dealing with imbalanced data is crucial as it can lead to biased models that perform poorly on minority c..."
    },
    {
      "id": "ai-ml-134",
      "courseId": "ai-res-3",
      "videoIndex": 134,
      "title": "Hyperparameter Tuning using Optuna | Bayesian Optimization using Optuna",
      "durationTimestamp": "59:23",
      "thumbnailUrl": "https://i.ytimg.com/vi/E2b3SKMw934/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=E2b3SKMw934",
      "description": "Optuna Paper - https://arxiv.org/pdf/1907.10902 Bayesian Optimization (TPE) Paper - https://arxiv.org/pdf/2304.11127 Code - https://colab.research.google.com/drive/1s-0-uDi2NmpJHCqPJefkbDKoCbfHyxqV?usp=sharing"
    }
  ],
  "ai-res-4": [
    {
      "id": "ai-dl-1",
      "courseId": "ai-res-4",
      "videoIndex": 1,
      "title": "100 Days of Deep Learning | Course Announcement",
      "durationTimestamp": "18:32",
      "thumbnailUrl": "https://i.ytimg.com/vi/2dH_qjc9mFg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=2dH_qjc9mFg",
      "description": "So we are finally starting with 100 days of Deep Learning Playlist! Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes If you find this video helpful, consider giving it a thumbs up and subscribing for more educational videos on d..."
    },
    {
      "id": "ai-dl-2",
      "courseId": "ai-res-4",
      "videoIndex": 2,
      "title": "What is Deep Learning? Deep Learning Vs Machine Learning | Complete Deep Learning Course",
      "durationTimestamp": "1:06:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/fHF22Wxuyw4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=fHF22Wxuyw4",
      "description": "Deep Learning is a subset of machine learning that involves neural networks with multiple layers (deep neural networks). It is designed to automatically learn hierarchical representations of data through the composition of increasingly complex fea..."
    },
    {
      "id": "ai-dl-3",
      "courseId": "ai-res-4",
      "videoIndex": 3,
      "title": "Types of Neural Networks | History of Deep Learning | Applications of Deep Learning",
      "durationTimestamp": "33:16",
      "thumbnailUrl": "https://i.ytimg.com/vi/fne_UE7hDn0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=fne_UE7hDn0",
      "description": "In this video, we'll break down the different types of neural networks, take a journey through the history of deep learning, and uncover real-world applications. Share your thoughts, experiences, or questions in the comments below. I love hearing ..."
    },
    {
      "id": "ai-dl-4",
      "courseId": "ai-res-4",
      "videoIndex": 4,
      "title": "What is a Perceptron? Perceptron Vs Neuron | Perceptron Geometric Intuition",
      "durationTimestamp": "38:34",
      "thumbnailUrl": "https://i.ytimg.com/vi/X7iIKPoZ0Sw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=X7iIKPoZ0Sw",
      "description": "Code - https://github.com/campusx-official/100-days-of-deep-learning/tree/main/day3 Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes A Perceptron is a simple type of artificial neural network algorithm developed by Frank Rosenbl..."
    },
    {
      "id": "ai-dl-5",
      "courseId": "ai-res-4",
      "videoIndex": 5,
      "title": "Perceptron Trick | How to train a Perceptron | Perceptron Part 2 |  Deep Learning Full Course",
      "durationTimestamp": "51:45",
      "thumbnailUrl": "https://i.ytimg.com/vi/Lu2bruOHN6g/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Lu2bruOHN6g",
      "description": "Code - https://github.com/campusx-official/100-days-of-deep-learning/tree/main/day4 Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Training a Perceptron involves adjusting its weights to correctly classify input data. The proc..."
    },
    {
      "id": "ai-dl-6",
      "courseId": "ai-res-4",
      "videoIndex": 6,
      "title": "Perceptron Loss Function | Hinge Loss | Binary Cross Entropy | Sigmoid Function",
      "durationTimestamp": "59:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/2_gCL5RAkHc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=2_gCL5RAkHc",
      "description": "The Perceptron Loss Function is a measure used to quantify how well a perceptron classifies data points. Common loss functions for perceptrons include: Hinge Loss: Suitable for binary classification problems, encouraging correct classifications wi..."
    },
    {
      "id": "ai-dl-7",
      "courseId": "ai-res-4",
      "videoIndex": 7,
      "title": "Problem with Perceptron",
      "durationTimestamp": "7:39",
      "thumbnailUrl": "https://i.ytimg.com/vi/Jp44b27VnOg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Jp44b27VnOg",
      "description": "The problem with Perceptrons lies in their limitation to learn complex patterns and functions, especially those that are not linearly separable. A Perceptron is a single-layer neural network with binary outputs, and it can only solve problems wher..."
    },
    {
      "id": "ai-dl-8",
      "courseId": "ai-res-4",
      "videoIndex": 8,
      "title": "MLP Notation",
      "durationTimestamp": "13:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/H0_3SJh4Rqs/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=H0_3SJh4Rqs",
      "description": "Multi-Layer Perceptron (MLP) Notation refers to the symbolic representation used to illustrate the architecture and connections within a neural network. In MLP, nodes (neurons) are organized into layers, including an input layer, hidden layers, an..."
    },
    {
      "id": "ai-dl-9",
      "courseId": "ai-res-4",
      "videoIndex": 9,
      "title": "Multi Layer Perceptron | MLP Intuition",
      "durationTimestamp": "37:46",
      "thumbnailUrl": "https://i.ytimg.com/vi/qw7wFGgNCSU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=qw7wFGgNCSU",
      "description": "A Multi-Layer Perceptron (MLP) is a type of artificial neural network characterized by its multiple layers of nodes (neurons). It consists of an input layer, one or more hidden layers, and an output layer. Each connection between nodes is associat..."
    },
    {
      "id": "ai-dl-10",
      "courseId": "ai-res-4",
      "videoIndex": 10,
      "title": "Forward Propagation | How a neural network predicts output?",
      "durationTimestamp": "15:31",
      "thumbnailUrl": "https://i.ytimg.com/vi/7MuiScUkboE/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=7MuiScUkboE",
      "description": "Forward Propagation is a fundamental step in the functioning of neural networks. It involves the transmission of input data through the network's layers to produce an output. Each layer processes the input using weights and activation functions, u..."
    },
    {
      "id": "ai-dl-11",
      "courseId": "ai-res-4",
      "videoIndex": 11,
      "title": "Customer Churn Prediction using ANN | Keras and Tensorflow | Deep Learning Classification",
      "durationTimestamp": "35:23",
      "thumbnailUrl": "https://i.ytimg.com/vi/9wmImImmgcI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=9wmImImmgcI",
      "description": "Customer Churn Prediction using Artificial Neural Networks (ANN) involves building a model to forecast whether a customer is likely to leave or continue using a service. The ANN learns from historical data, considering factors like usage patterns,..."
    },
    {
      "id": "ai-dl-12",
      "courseId": "ai-res-4",
      "videoIndex": 12,
      "title": "Handwritten Digit Classification using ANN | MNIST Dataset",
      "durationTimestamp": "28:40",
      "thumbnailUrl": "https://i.ytimg.com/vi/3xPT2Pk0Jds/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=3xPT2Pk0Jds",
      "description": "Handwritten Digit Classification using Artificial Neural Networks (ANN) involves training a model to recognize and classify handwritten digits, typically from 0 to 9. The ANN learns patterns from labeled datasets, allowing it to generalize and acc..."
    },
    {
      "id": "ai-dl-13",
      "courseId": "ai-res-4",
      "videoIndex": 13,
      "title": "Graduate Admission Prediction using ANN",
      "durationTimestamp": "17:43",
      "thumbnailUrl": "https://i.ytimg.com/vi/RCmiPBiA4qg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=RCmiPBiA4qg",
      "description": "In the world of artificial neural networks (ANN), predicting gre admissions becomes an exciting application. Using ANN, we create a predictive model that learns patterns from historical data, considering factors such as GRE scores, GPA, and other ..."
    },
    {
      "id": "ai-dl-14",
      "courseId": "ai-res-4",
      "videoIndex": 14,
      "title": "Loss Functions in Deep Learning | Deep Learning | CampusX",
      "durationTimestamp": "59:56",
      "thumbnailUrl": "https://i.ytimg.com/vi/gb5nm_3jBIo/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=gb5nm_3jBIo",
      "description": "In this video, we'll understand the concept of Loss Functions and their role in training neural networks. Join me for a straightforward explanation to grasp how these functions impact model performance. Notes: https://learnwith.campusx.in/s/store/..."
    },
    {
      "id": "ai-dl-15",
      "courseId": "ai-res-4",
      "videoIndex": 15,
      "title": "Backpropagation in Deep Learning | Part 1 | The What?",
      "durationTimestamp": "54:19",
      "thumbnailUrl": "https://i.ytimg.com/vi/6M1wWQmcUjQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=6M1wWQmcUjQ",
      "description": "In this video, we'll break down the fundamentals of Backpropagation, a key concept in neural networks. Join us for a simplified explanation and demystify the process that makes deep learning possible. Notes: https://learnwith.campusx.in/s/store/co..."
    },
    {
      "id": "ai-dl-16",
      "courseId": "ai-res-4",
      "videoIndex": 16,
      "title": "Backpropagation Part 2 | The How | Complete Deep Learning Playlist",
      "durationTimestamp": "59:56",
      "thumbnailUrl": "https://i.ytimg.com/vi/ma6hWrU-LaI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ma6hWrU-LaI",
      "description": "In this video, we'll break down the fundamentals of Backpropagation, a key concept in neural networks. Join us for a simplified explanation and demystify the process that makes deep learning possible. Notes: https://learnwith.campusx.in/s/store/co..."
    },
    {
      "id": "ai-dl-17",
      "courseId": "ai-res-4",
      "videoIndex": 17,
      "title": "Backpropagation Part 3 | The Why | Complete Deep Learning Playlist",
      "durationTimestamp": "40:21",
      "thumbnailUrl": "https://i.ytimg.com/vi/6xO-x8y0YSY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=6xO-x8y0YSY",
      "description": "Don't forget to check out the complete Deep Learning playlist for a comprehensive learning experience! Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Backprop Google Tool https://developers-dot-devsite-v2-prod.appspot.com/mach..."
    },
    {
      "id": "ai-dl-18",
      "courseId": "ai-res-4",
      "videoIndex": 18,
      "title": "Vanishing Gradient Problem in ANN | Exploding Gradient Problem | Code Example",
      "durationTimestamp": "32:16",
      "thumbnailUrl": "https://i.ytimg.com/vi/uCrevbBh0zM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=uCrevbBh0zM",
      "description": "Learn about the Vanishing and Exploding Gradient Problems in Artificial Neural Networks (ANNs) with practical code examples. Understand the challenges and solutions for training deep networks effectively. Improve your grasp on these important conc..."
    },
    {
      "id": "ai-dl-19",
      "courseId": "ai-res-4",
      "videoIndex": 19,
      "title": "MLP Memoization | Complete Deep Learning Playlist",
      "durationTimestamp": "25:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/rW0eeTXas4k/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=rW0eeTXas4k",
      "description": "In this video, we'll delve into the concept of Memoization, a technique to enhance performance in Machine Learning. Understand how MLPs benefit from this strategy, making computations more efficient. Notes: https://learnwith.campusx.in/s/store/cou..."
    },
    {
      "id": "ai-dl-20",
      "courseId": "ai-res-4",
      "videoIndex": 20,
      "title": "Gradient Descent in Neural Networks | Batch vs Stochastics vs Mini Batch Gradient Descent",
      "durationTimestamp": "37:53",
      "thumbnailUrl": "https://i.ytimg.com/vi/7z6yXpYk7sw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=7z6yXpYk7sw",
      "description": "This video breaks down Batch, Stochastic, and Mini-Batch methods, explaining their impact on the learning process. Discover the differences between them in simple terms. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Code used..."
    },
    {
      "id": "ai-dl-21",
      "courseId": "ai-res-4",
      "videoIndex": 21,
      "title": "How to Improve the Performance of a Neural Network",
      "durationTimestamp": "30:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/Ue_6n1yT_R8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Ue_6n1yT_R8",
      "description": "In this video, we share practical tips on enhancing the performance of your Neural Network. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Notes - https://drive.google.com/file/d/1FsOzMQltwI3CURqL9X6SJ-OBOqSDti1i/view?usp=sharing"
    },
    {
      "id": "ai-dl-22",
      "courseId": "ai-res-4",
      "videoIndex": 22,
      "title": "Early Stopping In Neural Networks | End to End Deep Learning Course",
      "durationTimestamp": "12:00",
      "thumbnailUrl": "https://i.ytimg.com/vi/Ygvskt5HadI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Ygvskt5HadI",
      "description": "Early stopping is a method in Deep Learning that allows you to specify an arbitrarily large number of training epochs and stop training once the model performance stops improving on the validation dataset. Notes: https://learnwith.campusx.in/s/sto..."
    },
    {
      "id": "ai-dl-23",
      "courseId": "ai-res-4",
      "videoIndex": 23,
      "title": "Data Scaling in Neural Network | Feature Scaling in ANN | End to End Deep Learning Course",
      "durationTimestamp": "16:55",
      "thumbnailUrl": "https://i.ytimg.com/vi/mzRO0cVppQ0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=mzRO0cVppQ0",
      "description": "Data scaling is a recommended pre-processing step when working with deep learning neural networks. Data scaling can be achieved by normalizing or standardizing real-valued input and output variables. Notes: https://learnwith.campusx.in/s/store/cou..."
    },
    {
      "id": "ai-dl-24",
      "courseId": "ai-res-4",
      "videoIndex": 24,
      "title": "Dropout Layer in Deep Learning | Dropouts in ANN | End to End Deep Learning",
      "durationTimestamp": "27:51",
      "thumbnailUrl": "https://i.ytimg.com/vi/gyTlcHVeBjM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=gyTlcHVeBjM",
      "description": "Dropout is an approach to regularization in neural networks which helps reduce interdependent learning amongst the neurons. Dropout is used as a regularization technique in order to reduce overfitting. Notes: https://learnwith.campusx.in/s/store/c..."
    },
    {
      "id": "ai-dl-25",
      "courseId": "ai-res-4",
      "videoIndex": 25,
      "title": "Dropout Layers in ANN | Code Example | Regression | Classification",
      "durationTimestamp": "19:17",
      "thumbnailUrl": "https://i.ytimg.com/vi/tgIx04ML7-Y/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=tgIx04ML7-Y",
      "description": "In this video, we explore the power of Dropout Layers with code examples for both Regression and Classification tasks. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Classification Code - https://colab.research.google.com/driv..."
    },
    {
      "id": "ai-dl-26",
      "courseId": "ai-res-4",
      "videoIndex": 26,
      "title": "Regularization in Deep Learning | L2 Regularization in ANN | L1 Regularization | Weight Decay in ANN",
      "durationTimestamp": "35:57",
      "thumbnailUrl": "https://i.ytimg.com/vi/4xRonrhtkzc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=4xRonrhtkzc",
      "description": "Regularization is a set of techniques that can prevent overfitting in neural networks and thus improve the accuracy of a Deep Learning model when facing completely new data from the problem domain. Notes: https://learnwith.campusx.in/s/store/cours..."
    },
    {
      "id": "ai-dl-27",
      "courseId": "ai-res-4",
      "videoIndex": 27,
      "title": "Activation Functions in Deep Learning | Sigmoid, Tanh and Relu Activation Function",
      "durationTimestamp": "44:52",
      "thumbnailUrl": "https://i.ytimg.com/vi/7LcUkgzx3AY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=7LcUkgzx3AY",
      "description": "In artificial neural networks, each neuron forms a weighted sum of its inputs and passes the resulting scalar value through a function referred to as an activation function or transfer function. In this video, we explain the basics of Sigmoid, Tan..."
    },
    {
      "id": "ai-dl-28",
      "courseId": "ai-res-4",
      "videoIndex": 28,
      "title": "Relu Variants Explained | Leaky Relu | Parametric Relu | Elu | Selu | Activation Functions Part 2",
      "durationTimestamp": "33:25",
      "thumbnailUrl": "https://i.ytimg.com/vi/2OwWs7Hzr9g/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=2OwWs7Hzr9g",
      "description": "This is part 2 of the Activation Function Series. In this video, we will discuss the dying relu problem and then learn about the following variants of Relu activation function: 1. Leaky Relu 2. Parametric Relu 3. Elu 4. Selu Notes: https://learnwi..."
    },
    {
      "id": "ai-dl-29",
      "courseId": "ai-res-4",
      "videoIndex": 29,
      "title": "Weight Initialization Techniques | What not to do? | Deep Learning",
      "durationTimestamp": "49:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/2MSY0HwH5Ss/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=2MSY0HwH5Ss",
      "description": "In this video, I'll guide you through weight initialization techniques in neural networks and highlight what NOT to do. From common mistakes to misconceptions, I'll help you navigate the dos and don'ts in optimizing your network's performance. Not..."
    },
    {
      "id": "ai-dl-30",
      "courseId": "ai-res-4",
      "videoIndex": 30,
      "title": "Xavier/Glorat And He Weight Initialization in Deep Learning",
      "durationTimestamp": "21:07",
      "thumbnailUrl": "https://i.ytimg.com/vi/nwVOSgcrbQI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=nwVOSgcrbQI",
      "description": "In this video, I will talk about weight initialization techniques in a Neural network. The following pointers would be discussed: 1.  Weight initialization techniques in neural networks 2.  Xavier initialization in neural network 3.  He initializa..."
    },
    {
      "id": "ai-dl-31",
      "courseId": "ai-res-4",
      "videoIndex": 31,
      "title": "Batch Normalization in Deep Learning | Batch Learning in Keras",
      "durationTimestamp": "43:39",
      "thumbnailUrl": "https://i.ytimg.com/vi/2AscwXePInA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=2AscwXePInA",
      "description": "This video explores how Batch Normalization transforms the internal workings of neural networks by normalizing inputs within each mini-batch. By maintaining stable activations throughout the training process, Batch Normalization improves convergen..."
    },
    {
      "id": "ai-dl-32",
      "courseId": "ai-res-4",
      "videoIndex": 32,
      "title": "Optimizers in Deep Learning | Part 1 | Complete Deep Learning Course",
      "durationTimestamp": "22:34",
      "thumbnailUrl": "https://i.ytimg.com/vi/iCTTnQJn50E/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=iCTTnQJn50E",
      "description": "This video breaks down the key algorithms that fine-tune neural network parameters for optimal performance. From classic techniques like Gradient Descent to advanced methods like Adam and RMSprop, explore how optimizers play a crucial role in trai..."
    },
    {
      "id": "ai-dl-33",
      "courseId": "ai-res-4",
      "videoIndex": 33,
      "title": "Exponentially Weighted Moving Average or Exponential Weighted Average | Deep Learning",
      "durationTimestamp": "18:51",
      "thumbnailUrl": "https://i.ytimg.com/vi/jAqVuYJ8TP8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=jAqVuYJ8TP8",
      "description": "Exponentially Weighted Moving Average  is a very important concept to understand Optimization in Deep Learning. It means that as we move forward, we simultaneously calculate the average of the points. In Exponentially Weighted Moving Average, we c..."
    },
    {
      "id": "ai-dl-34",
      "courseId": "ai-res-4",
      "videoIndex": 34,
      "title": "SGD with Momentum Explained in Detail with Animations | Optimizers in Deep Learning Part 2",
      "durationTimestamp": "38:25",
      "thumbnailUrl": "https://i.ytimg.com/vi/vVS4csXRlcQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=vVS4csXRlcQ",
      "description": "In this video, we will understand in detail what is Momentum Optimizer in Deep Learning. Momentum Optimizer in Deep Learning is a technique that reduces the time taken to train a model.  The path of learning in mini-batch gradient descent is zig-z..."
    },
    {
      "id": "ai-dl-35",
      "courseId": "ai-res-4",
      "videoIndex": 35,
      "title": "Nesterov Accelerated Gradient (NAG) Explained in Detail | Animations | Optimizers in Deep Learning",
      "durationTimestamp": "27:50",
      "thumbnailUrl": "https://i.ytimg.com/vi/rKG9E6rce1c/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=rKG9E6rce1c",
      "description": "The acceleration of momentum can overshoot the minima at the bottom of basins or valleys. Nesterov momentum is an extension of momentum that involves calculating the decaying moving average of the gradients of projected positions in the search spa..."
    },
    {
      "id": "ai-dl-36",
      "courseId": "ai-res-4",
      "videoIndex": 36,
      "title": "AdaGrad Explained in Detail with Animations | Optimizers in Deep Learning Part 4",
      "durationTimestamp": "26:29",
      "thumbnailUrl": "https://i.ytimg.com/vi/nqL9xYmhEpg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=nqL9xYmhEpg",
      "description": "Adaptive Gradient Algorithm (Adagrad) is an algorithm for gradient-based optimization. The learning rate is adapted component-wise to the parameters by incorporating knowledge of past observations. Notes: https://learnwith.campusx.in/s/store/cours..."
    },
    {
      "id": "ai-dl-37",
      "courseId": "ai-res-4",
      "videoIndex": 37,
      "title": "RMSProp Explained in Detail with Animations | Optimizers in Deep Learning Part 5",
      "durationTimestamp": "12:38",
      "thumbnailUrl": "https://i.ytimg.com/vi/p0wSmKslWi0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=p0wSmKslWi0",
      "description": "Root Mean Squared Propagation, or RMSProp, is an extension of gradient descent and the AdaGrad version of gradient descent that uses a decaying average of partial gradients in the adaptation of the step size for each parameter. Notes: https://lear..."
    },
    {
      "id": "ai-dl-38",
      "courseId": "ai-res-4",
      "videoIndex": 38,
      "title": "Adam Optimizer Explained in Detail with Animations | Optimizers in Deep Learning Part 5",
      "durationTimestamp": "12:39",
      "thumbnailUrl": "https://i.ytimg.com/vi/N5AynalXD9g/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=N5AynalXD9g",
      "description": "Adaptive Moment Estimation is an algorithm for optimization technique for gradient descent. The method is really efficient when working with large problems involving a lot of data or parameters. It requires less memory and is efficient. Intuitivel..."
    },
    {
      "id": "ai-dl-39",
      "courseId": "ai-res-4",
      "videoIndex": 39,
      "title": "Keras Tuner | Hyperparameter Tuning a Neural Network",
      "durationTimestamp": "1:05:34",
      "thumbnailUrl": "https://i.ytimg.com/vi/oYnyNLj8RMA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=oYnyNLj8RMA",
      "description": "KerasTuner is an easy-to-use, scalable hyperparameter optimization framework that solves the pain points of hyperparameter search. Easily configure your search space with a define-by-run syntax, then leverage one of the available search algorithms..."
    },
    {
      "id": "ai-dl-40",
      "courseId": "ai-res-4",
      "videoIndex": 40,
      "title": "What is Convolutional Neural Network (CNN) | CNN Intution",
      "durationTimestamp": "27:10",
      "thumbnailUrl": "https://i.ytimg.com/vi/hDVFXf74P-U/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=hDVFXf74P-U",
      "description": "In this video, we will start our discussion around CNN. CNNs are one of the most popular neural network architectures. CNNs are used extensively in image-related data in applications like image classification, object detection, etc. Notes: https:/..."
    },
    {
      "id": "ai-dl-41",
      "courseId": "ai-res-4",
      "videoIndex": 41,
      "title": "CNN Vs Visual Cortex | The Famous Cat Experiment | History of CNN",
      "durationTimestamp": "15:02",
      "thumbnailUrl": "https://i.ytimg.com/vi/aslTGS9ef98/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=aslTGS9ef98",
      "description": "In this video, we will discuss the history of CNNs. We will discuss how CNNs are inspired by our own Visual Cortex, we will also discuss about the famous Cat Experiment conducted by Hubel and Weisel that led to the discovery of CNNs. Notes: https:..."
    },
    {
      "id": "ai-dl-42",
      "courseId": "ai-res-4",
      "videoIndex": 42,
      "title": "CNN Part 3 | Convolution Operation",
      "durationTimestamp": "29:14",
      "thumbnailUrl": "https://i.ytimg.com/vi/cgJx3GvQ5y8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=cgJx3GvQ5y8",
      "description": "Convolution is one of the main building blocks of a CNN. The term convolution refers to the mathematical combination of two functions to produce a third function. It merges two sets of information. In the case of a CNN, the convolution is performe..."
    },
    {
      "id": "ai-dl-43",
      "courseId": "ai-res-4",
      "videoIndex": 43,
      "title": "Padding & Strides in CNN | CNN Lecture 4 | Deep Learning",
      "durationTimestamp": "24:26",
      "thumbnailUrl": "https://i.ytimg.com/vi/btWE6SsdDZA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=btWE6SsdDZA",
      "description": "Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Code used - https://colab.research.google.com/drive/1HBMLctcBnhvV6Rj62Zc8eAXERQw54l2H?usp=sharing"
    },
    {
      "id": "ai-dl-44",
      "courseId": "ai-res-4",
      "videoIndex": 44,
      "title": "Pooling Layer in CNN | MaxPooling in Convolutional Neural Network",
      "durationTimestamp": "27:54",
      "thumbnailUrl": "https://i.ytimg.com/vi/DwmGefkowCU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=DwmGefkowCU",
      "description": "The pooling operation involves sliding a two-dimensional filter over each channel of the feature map and summarising the features lying within the region covered by the filter. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Co..."
    },
    {
      "id": "ai-dl-45",
      "courseId": "ai-res-4",
      "videoIndex": 45,
      "title": "CNN Architecture | LeNet -5 Architecture",
      "durationTimestamp": "20:00",
      "thumbnailUrl": "https://i.ytimg.com/vi/ewsvsJQOuTI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ewsvsJQOuTI",
      "description": "In this tutorial, we unravel the layers and workings of LeNet-5, a pioneering CNN architecture. Whether you're a student, developer, or just curious about neural networks, this video provides an accessible breakdown of LeNet-5. Watch now to deepen..."
    },
    {
      "id": "ai-dl-46",
      "courseId": "ai-res-4",
      "videoIndex": 46,
      "title": "Comparing CNN Vs ANN  | CampusX",
      "durationTimestamp": "17:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/niE5DRKvD_E/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=niE5DRKvD_E",
      "description": "Know the differences between Convolutional Neural Networks (CNNs) and Artificial Neural Networks (ANNs) in our latest video. We explore the unique architectures of CNNs and ANNs, comparing their structures, applications, and strengths. Notes: http..."
    },
    {
      "id": "ai-dl-47",
      "courseId": "ai-res-4",
      "videoIndex": 47,
      "title": "Backpropagation in CNN | Part 1 | Deep Learning",
      "durationTimestamp": "36:21",
      "thumbnailUrl": "https://i.ytimg.com/vi/RvCCFttGFMY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=RvCCFttGFMY",
      "description": "This is part 1 of a 3-part series where we will discuss in detail how the backpropagation algorithm works in a CNN. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes"
    },
    {
      "id": "ai-dl-48",
      "courseId": "ai-res-4",
      "videoIndex": 48,
      "title": "CNN Backpropagation Part 2 | How Backpropagation works on Convolution, Maxpooling and Flatten Layers",
      "durationTimestamp": "43:27",
      "thumbnailUrl": "https://i.ytimg.com/vi/OoSDzOodY3Y/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=OoSDzOodY3Y",
      "description": "This video explains in great detail how the backpropagation algorithm works in the case of CNN. We will learn how to apply backprop on flatten, maxpooling and convolution layers. I recommend you watch the 1st part before watching this one. Here is..."
    },
    {
      "id": "ai-dl-49",
      "courseId": "ai-res-4",
      "videoIndex": 49,
      "title": "Cat Vs Dog Image Classification Project | Deep Learning Project | CNN Project",
      "durationTimestamp": "27:29",
      "thumbnailUrl": "https://i.ytimg.com/vi/0K4J_PTgysc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=0K4J_PTgysc",
      "description": "Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Dataset used - https://www.kaggle.com/datasets/salader/dogsvscats Google Colab Notebook (Updated Jun 2026) - https://colab.research.google.com/drive/1S6CYa2sOwluV8xz2RF0QDrpXjdNs3..."
    },
    {
      "id": "ai-dl-50",
      "courseId": "ai-res-4",
      "videoIndex": 50,
      "title": "Data Augmentation in Deep Learning | CNN",
      "durationTimestamp": "26:49",
      "thumbnailUrl": "https://i.ytimg.com/vi/sM2C-SsREgM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=sM2C-SsREgM",
      "description": "In this tutorial, we explore the concept of Data Augmentation, a technique that enhances model performance by diversifying training data. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes"
    },
    {
      "id": "ai-dl-51",
      "courseId": "ai-res-4",
      "videoIndex": 51,
      "title": "Pretrained models in CNN | ImageNET Dataset | ILSVRC | Keras Code",
      "durationTimestamp": "24:28",
      "thumbnailUrl": "https://i.ytimg.com/vi/0MVXteg7TB4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=0MVXteg7TB4",
      "description": "A pre-trained model is a model created and trained by someone else to solve a problem that is similar to ours. In practice, someone is almost always a tech giant or a group of star researchers. They usually choose a very large dataset as their bas..."
    },
    {
      "id": "ai-dl-52",
      "courseId": "ai-res-4",
      "videoIndex": 52,
      "title": "What does a CNN see? | Visualizing CNN Filters and Feature Maps | CampusX",
      "durationTimestamp": "13:03",
      "thumbnailUrl": "https://i.ytimg.com/vi/WJysB1RK2vM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=WJysB1RK2vM",
      "description": "Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Code was taken from this awesome blog post - https://machinelearningmastery.com/how-to-visualize-filters-and-feature-maps-in-convolutional-neural-networks/ Code - https://colab.re..."
    },
    {
      "id": "ai-dl-53",
      "courseId": "ai-res-4",
      "videoIndex": 53,
      "title": "What is Transfer Learning? Transfer Learning in Keras | Fine Tuning Vs Feature Extraction",
      "durationTimestamp": "33:53",
      "thumbnailUrl": "https://i.ytimg.com/vi/WWcgHjuKVqA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=WWcgHjuKVqA",
      "description": "Transfer learning is a research problem in machine learning that focuses on storing knowledge gained while solving one problem and applying it to a different but related problem. For example, knowledge gained while learning to recognize cars could..."
    },
    {
      "id": "ai-dl-54",
      "courseId": "ai-res-4",
      "videoIndex": 54,
      "title": "Keras Functional Model | How to build non-linear Neural Networks?",
      "durationTimestamp": "25:38",
      "thumbnailUrl": "https://i.ytimg.com/vi/OvQQP1QVru8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=OvQQP1QVru8",
      "description": "The Keras functional API is a way to create models that are more flexible than the Sequential API. The functional API can handle models with non-linear topology, shared layers, and even multiple inputs or outputs. The main idea is that a deep lear..."
    },
    {
      "id": "ai-dl-55",
      "courseId": "ai-res-4",
      "videoIndex": 55,
      "title": "Why RNNs are needed | RNNs Vs ANNs | RNN Part 1",
      "durationTimestamp": "30:19",
      "thumbnailUrl": "https://i.ytimg.com/vi/4KpRP-YUw6c/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=4KpRP-YUw6c",
      "description": "A recurrent neural network (RNN) is a class of artificial neural networks where connections between nodes can create a cycle, allowing output from some nodes to affect subsequent input to the same nodes. This allows it to exhibit temporal dynamic ..."
    },
    {
      "id": "ai-dl-56",
      "courseId": "ai-res-4",
      "videoIndex": 56,
      "title": "Recurrent Neural Network | Forward Propagation | Architecture",
      "durationTimestamp": "41:44",
      "thumbnailUrl": "https://i.ytimg.com/vi/BjWqCcbusMM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=BjWqCcbusMM",
      "description": "A recurrent neural network (RNN) is a class of artificial neural networks where connections between nodes can create a cycle, allowing output from some nodes to affect subsequent input to the same nodes. This allows it to exhibit temporal dynamic ..."
    },
    {
      "id": "ai-dl-57",
      "courseId": "ai-res-4",
      "videoIndex": 57,
      "title": "RNN Sentiment Analysis | RNN Code Example in Keras | CampusX",
      "durationTimestamp": "36:57",
      "thumbnailUrl": "https://i.ytimg.com/vi/JgnbwKnHMZQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=JgnbwKnHMZQ",
      "description": "Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Code: https://colab.research.google.com/drive/1uY7NEHi59w4FkB8TViwLjUDKxgCA8W5G?usp=sharing https://colab.research.google.com/drive/1FLJZ0LeMiW_6OkzFrC-o035YZPBFEFR4?usp=sharing"
    },
    {
      "id": "ai-dl-58",
      "courseId": "ai-res-4",
      "videoIndex": 58,
      "title": "Types of RNN | Many to Many | One to Many | Many to One RNNs",
      "durationTimestamp": "22:20",
      "thumbnailUrl": "https://i.ytimg.com/vi/TkOBxzhIySg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=TkOBxzhIySg",
      "description": "Explore the different types of Recurrent Neural Networks (RNNs) in our latest video, focusing on Many-to-Many, One-to-Many, and Many-to-One architectures. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes"
    },
    {
      "id": "ai-dl-59",
      "courseId": "ai-res-4",
      "videoIndex": 59,
      "title": "How Backpropagation works in RNN | Backpropagation Through Time",
      "durationTimestamp": "33:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/OvCz1acvt-k/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=OvCz1acvt-k",
      "description": "This video dives into the mechanics of Backpropagation in Recurrent Neural Networks (RNNs), specifically exploring the concept of Backpropagation Through Time (BPTT). Learn how RNNs handle the flow of gradients over time, allowing the network to l..."
    },
    {
      "id": "ai-dl-60",
      "courseId": "ai-res-4",
      "videoIndex": 60,
      "title": "Problems with RNN | 100 Days of Deep Learning",
      "durationTimestamp": "32:18",
      "thumbnailUrl": "https://i.ytimg.com/vi/AWHSZzp96kM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=AWHSZzp96kM",
      "description": "In this video, we explore the common challenges and problems associated with Recurrent Neural Networks (RNNs). From vanishing and exploding gradients to difficulties in capturing long-term dependencies, we delve into the limitations of RNNs. Notes..."
    },
    {
      "id": "ai-dl-61",
      "courseId": "ai-res-4",
      "videoIndex": 61,
      "title": "LSTM | Long Short Term Memory | Part 1 | The What? | CampusX",
      "durationTimestamp": "42:18",
      "thumbnailUrl": "https://i.ytimg.com/vi/z7IPBg6MyrU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=z7IPBg6MyrU",
      "description": "In today's video, we're diving deep into the world of neural networks to unravel the secrets of Long Short Term Memory (LSTM). If you've ever wondered how neural networks remember and learn from sequences, this is the video for you! Notes: https:/..."
    },
    {
      "id": "ai-dl-62",
      "courseId": "ai-res-4",
      "videoIndex": 62,
      "title": "LSTM Architecture | Part 2 | The How? | CampusX",
      "durationTimestamp": "1:10:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/Akv3poqqwI4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Akv3poqqwI4",
      "description": "This is the part 2 of the LSTM series. Watch the video till the end to understand the concept in detail. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Code - https://colah.github.io/posts/2015-08-Understanding-LSTMs/"
    },
    {
      "id": "ai-dl-63",
      "courseId": "ai-res-4",
      "videoIndex": 63,
      "title": "LSTM | Part 3 | Next Word Predictor Using | CampusX",
      "durationTimestamp": "1:00:05",
      "thumbnailUrl": "https://i.ytimg.com/vi/fiqo6uPCJVI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=fiqo6uPCJVI",
      "description": "In this video, we talk about Next Word Predictor Using LSTM. Watch the video till the end to understand the concept in detail. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Notebook: https://colab.research.google.com/drive/1e..."
    },
    {
      "id": "ai-dl-64",
      "courseId": "ai-res-4",
      "videoIndex": 64,
      "title": "Gated Recurrent Unit | Deep Learning | GRU | CampusX",
      "durationTimestamp": "1:26:22",
      "thumbnailUrl": "https://i.ytimg.com/vi/QQfZAoNGQmE/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=QQfZAoNGQmE",
      "description": "In this video, we talk about Gated Recurrent Unit. Watch the video till the end to understand the concept in detail. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes"
    },
    {
      "id": "ai-dl-65",
      "courseId": "ai-res-4",
      "videoIndex": 65,
      "title": "Deep RNNs | Stacked RNNs | Stacked LSTMs | Stacked GRUs | CampusX",
      "durationTimestamp": "45:08",
      "thumbnailUrl": "https://i.ytimg.com/vi/mlDkTrlLaio/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=mlDkTrlLaio",
      "description": "In this video, we talk about Deep RNNs. Watch the video till the end to understand the concept in detail. Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Notebook - https://colab.research.google.com/drive/1c4eN4cPxajCpFG6yr1mAU..."
    },
    {
      "id": "ai-dl-66",
      "courseId": "ai-res-4",
      "videoIndex": 66,
      "title": "Bidirectional RNN | BiLSTM | Bidirectional LSTM | Bidirectional GRU",
      "durationTimestamp": "25:41",
      "thumbnailUrl": "https://i.ytimg.com/vi/k2NSm3MNdYg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=k2NSm3MNdYg",
      "description": "Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes"
    },
    {
      "id": "ai-dl-67",
      "courseId": "ai-res-4",
      "videoIndex": 67,
      "title": "The Epic History of Large Language Models (LLMs) | From LSTMs to ChatGPT | CampusX",
      "durationTimestamp": "1:27:06",
      "thumbnailUrl": "https://i.ytimg.com/vi/8fX3rOjTloc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=8fX3rOjTloc",
      "description": "Dive into the captivating journey of Large Language Models (LLMs) in this exploration!  From their humble beginnings to transforming natural language processing, understand the evolution of these giants in the world of AI. Whether you're a tech en..."
    },
    {
      "id": "ai-dl-68",
      "courseId": "ai-res-4",
      "videoIndex": 68,
      "title": "Encoder Decoder | Sequence-to-Sequence Architecture | Deep Learning | CampusX",
      "durationTimestamp": "1:13:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/KiL74WsgxoA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=KiL74WsgxoA",
      "description": "In this video, we unravel the complexities of the Encoder-Decoder architecture, focusing on its application in sequence-to-sequence tasks. Whether you're a student, developer, or tech enthusiast, join us on this learning journey as we break down t..."
    },
    {
      "id": "ai-dl-69",
      "courseId": "ai-res-4",
      "videoIndex": 69,
      "title": "Attention Mechanism in 1 video | Seq2Seq Networks | Encoder Decoder Architecture",
      "durationTimestamp": "41:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/rj5V6q6-XUM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=rj5V6q6-XUM",
      "description": "In this video, we introduce the importance of attention mechanisms, provide a quick overview of the encoder-decoder structure, and explain how the workflow functions. An attention mechanism is a key concept in the field of machine learning, partic..."
    },
    {
      "id": "ai-dl-70",
      "courseId": "ai-res-4",
      "videoIndex": 70,
      "title": "Bahdanau Attention Vs Luong Attention",
      "durationTimestamp": "52:33",
      "thumbnailUrl": "https://i.ytimg.com/vi/0hZT4_fHfNQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=0hZT4_fHfNQ",
      "description": "Bahdanau Attention and Luong Attention are two mechanisms used in the context of sequence-to-sequence models, especially in machine translation tasks. These attention mechanisms allow the model to focus on different parts of the input sequence whe..."
    },
    {
      "id": "ai-dl-71",
      "courseId": "ai-res-4",
      "videoIndex": 71,
      "title": "Introduction to Transformers | Transformers Part 1",
      "durationTimestamp": "1:00:05",
      "thumbnailUrl": "https://i.ytimg.com/vi/BjRVS2wTtcA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=BjRVS2wTtcA",
      "description": "Transformers are a powerful class of models in natural language processing and machine learning, revolutionizing various tasks. From attention mechanisms to self-attention, transformers have reshaped the landscape of deep learning. Introduced by V..."
    },
    {
      "id": "ai-dl-72",
      "courseId": "ai-res-4",
      "videoIndex": 72,
      "title": "What is Self Attention | Transformers Part 2 | CampusX",
      "durationTimestamp": "23:21",
      "thumbnailUrl": "https://i.ytimg.com/vi/XnGGmvpDLA0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=XnGGmvpDLA0",
      "description": "Self Attention is a mechanism that enables transformers to weigh the importance of different words in a sequence relative to each other. It allows the model to focus on relevant information, improving its ability to capture long-range dependencies..."
    },
    {
      "id": "ai-dl-73",
      "courseId": "ai-res-4",
      "videoIndex": 73,
      "title": "Self Attention in Transformers | Deep Learning | Simple Explanation with Code!",
      "durationTimestamp": "1:23:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/-tCKPl_8Xb8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=-tCKPl_8Xb8",
      "description": "Self Attention works by computing attention scores for each word in a sequence based on its relationship with every other word. These scores determine how much focus each word receives during processing, allowing the model to prioritize relevant i..."
    },
    {
      "id": "ai-dl-74",
      "courseId": "ai-res-4",
      "videoIndex": 74,
      "title": "Scaled Dot Product Attention | Why do we scale Self Attention?",
      "durationTimestamp": "50:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/r7mAt0iVqwo/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=r7mAt0iVqwo",
      "description": "Scaling Self Attention in Scaled Dot Product Attention is crucial for stabilizing training, optimizing dataset utilization, and improving the model's ability to focus on relevant information within sequences by standardizing the variance of dot pr..."
    },
    {
      "id": "ai-dl-75",
      "courseId": "ai-res-4",
      "videoIndex": 75,
      "title": "Self Attention Geometric Intuition | How to Visualize Self Attention | CampusX",
      "durationTimestamp": "20:52",
      "thumbnailUrl": "https://i.ytimg.com/vi/5ZgGuujZSbs/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=5ZgGuujZSbs",
      "description": "Visualizing Self Attention offers insights into how attention weights are computed and distributed across input tokens. By understanding the geometric interpretation, we can perceive how attention mechanisms dynamically focus on relevant informati..."
    },
    {
      "id": "ai-dl-76",
      "courseId": "ai-res-4",
      "videoIndex": 76,
      "title": "Why is Self Attention called \"Self\"? | Self Attention Vs Luong Attention in Depth Lecture | CampusX",
      "durationTimestamp": "22:35",
      "thumbnailUrl": "https://i.ytimg.com/vi/o4ZVA0TuDRg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=o4ZVA0TuDRg",
      "description": "The term \"self\" in \"self-attention\" refers to the fact that the attention mechanism is applied to the same sequence or input, rather than relating an input to an output sequence. In other words, self-attention allows the model to learn about the r..."
    },
    {
      "id": "ai-dl-77",
      "courseId": "ai-res-4",
      "videoIndex": 77,
      "title": "What is Multi-head Attention in Transformers | Multi-head Attention v Self Attention | Deep Learning",
      "durationTimestamp": "38:27",
      "thumbnailUrl": "https://i.ytimg.com/vi/bX2QwpjsmuA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=bX2QwpjsmuA",
      "description": "Multi-head Attention enhances the expressiveness and representational capacity of Transformers by allowing the model to attend to different parts of the input data simultaneously. By utilizing multiple attention heads, the model can capture divers..."
    },
    {
      "id": "ai-dl-78",
      "courseId": "ai-res-4",
      "videoIndex": 78,
      "title": "Positional Encoding in Transformers | Deep Learning | CampusX",
      "durationTimestamp": "1:13:15",
      "thumbnailUrl": "https://i.ytimg.com/vi/GeoQBNNqIbM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=GeoQBNNqIbM",
      "description": "Positional Encoding is a technique used in transformers to inject information about the position of tokens in a sequence. Since transformers lack inherent sequence order awareness, positional encodings enable the model to capture the order of word..."
    },
    {
      "id": "ai-dl-79",
      "courseId": "ai-res-4",
      "videoIndex": 79,
      "title": "Layer Normalization in Transformers | Layer Norm Vs Batch Norm",
      "durationTimestamp": "46:57",
      "thumbnailUrl": "https://i.ytimg.com/vi/qti0QPdaelg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=qti0QPdaelg",
      "description": "Layer Normalization is a technique used to stabilize and accelerate the training of transformers by normalizing the inputs across the features. It adjusts and scales the activations, ensuring consistent output distributions. This helps in reducing..."
    },
    {
      "id": "ai-dl-80",
      "courseId": "ai-res-4",
      "videoIndex": 80,
      "title": "Transformer Architecture | Part 1 Encoder Architecture | CampusX",
      "durationTimestamp": "54:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/Vs87qcdm8l0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Vs87qcdm8l0",
      "description": "The Encoder in transformer architecture processes input sequences by applying layers of multi-head self-attention and feed-forward networks. Each layer consists of self-attention mechanisms followed by layer normalization and feed-forward neural n..."
    },
    {
      "id": "ai-dl-81",
      "courseId": "ai-res-4",
      "videoIndex": 81,
      "title": "Masked Self Attention | Masked Multi-head Attention in Transformer | Transformer Decoder",
      "durationTimestamp": "1:00:54",
      "thumbnailUrl": "https://i.ytimg.com/vi/m6onaKFzF94/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=m6onaKFzF94",
      "description": "Masked Multi-head Attention is used in transformer models to ensure that each token in a sequence only attends to previous tokens and itself, not future tokens. This masking is essential for autoregressive tasks like language generation, enabling ..."
    },
    {
      "id": "ai-dl-82",
      "courseId": "ai-res-4",
      "videoIndex": 82,
      "title": "Cross Attention in Transformers | 100 Days Of Deep Learning | CampusX",
      "durationTimestamp": "34:07",
      "thumbnailUrl": "https://i.ytimg.com/vi/smOnJtCevoU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=smOnJtCevoU",
      "description": "Cross Attention is a mechanism in transformer models where the attention is applied between different sequences, typically between the output of one layer and the input of another. It allows the model to focus on relevant parts of the input sequen..."
    },
    {
      "id": "ai-dl-83",
      "courseId": "ai-res-4",
      "videoIndex": 83,
      "title": "Transformer Decoder Architecture | Deep Learning | CampusX",
      "durationTimestamp": "48:26",
      "thumbnailUrl": "https://i.ytimg.com/vi/DI2_hrAulYo/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=DI2_hrAulYo",
      "description": "The Decoder in a transformer architecture generates output sequences by attending to both the previous tokens (via masked self-attention) and the encoder\u2019s output (via cross-attention). Each decoder layer consists of multi-head self-attention, cro..."
    },
    {
      "id": "ai-dl-84",
      "courseId": "ai-res-4",
      "videoIndex": 84,
      "title": "Transformer Inference | How Inference is done in Transformer? | Deep Learning | CampusX",
      "durationTimestamp": "45:12",
      "thumbnailUrl": "https://i.ytimg.com/vi/FtsMOzlwxws/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=FtsMOzlwxws",
      "description": "Inference in transformers involves generating predictions from the trained model. During inference, the decoder predicts one token at a time, using previously generated tokens and attending to the encoder's output. The process continues iterativel..."
    }
  ],
  "ai-res-5": [
    {
      "id": "ai-genai-1",
      "courseId": "ai-res-5",
      "videoIndex": 1,
      "title": "GenAI Roadmap for Beginners | End-to-End GenAI Course 2025 | CampusX",
      "durationTimestamp": "50:15",
      "thumbnailUrl": "https://i.ytimg.com/vi/pSVk-5WemQ0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=pSVk-5WemQ0",
      "description": "Hello Guys! Here is the most requested playlist. Happy Learning! Resources: https://github.com/Yash-Kavaiya/End-to-End-GenAI-Course-2025-CampusX My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-2",
      "courseId": "ai-res-5",
      "videoIndex": 2,
      "title": "Generative AI using LangChain | GENAI for Beginners | CampusX",
      "durationTimestamp": "15:19",
      "thumbnailUrl": "https://i.ytimg.com/vi/_3ezSpJw2E8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=_3ezSpJw2E8",
      "description": ""
    },
    {
      "id": "ai-genai-3",
      "courseId": "ai-res-5",
      "videoIndex": 3,
      "title": "Introduction to LangChain | LangChain for Beginners | Video 1 | CampusX",
      "durationTimestamp": "37:44",
      "thumbnailUrl": "https://i.ytimg.com/vi/nlz9j-r0U9U/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=nlz9j-r0U9U",
      "description": ""
    },
    {
      "id": "ai-genai-4",
      "courseId": "ai-res-5",
      "videoIndex": 4,
      "title": "LangChain Components | GenAI using LangChain | Video 2 | CampusX",
      "durationTimestamp": "53:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/-xSJA8-o6Eg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=-xSJA8-o6Eg",
      "description": ""
    },
    {
      "id": "ai-genai-5",
      "courseId": "ai-res-5",
      "videoIndex": 5,
      "title": "LangChain Models | Indepth Tutorial with Code Demo | Video 3 | CampusX",
      "durationTimestamp": "1:42:03",
      "thumbnailUrl": "https://i.ytimg.com/vi/HdcLE8JuMrA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=HdcLE8JuMrA",
      "description": "Code - https://github.com/campusx-official/langchain-models Full GENAI Playlist: https://www.youtube.com/playlist?list=PLKnIA16_RmvaTbihpo4MtzVm4XOQa0ER0 My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-6",
      "courseId": "ai-res-5",
      "videoIndex": 6,
      "title": "Prompts in LangChain | Generative AI using LangChain | Video 4 | CampusX",
      "durationTimestamp": "1:18:33",
      "thumbnailUrl": "https://i.ytimg.com/vi/3TGqlQxpuU0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=3TGqlQxpuU0",
      "description": "Code - https://github.com/campusx-official/langchain-prompts My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-7",
      "courseId": "ai-res-5",
      "videoIndex": 7,
      "title": "Structured Output in LangChain | Generative AI using LangChain | Video 5 | CampusX",
      "durationTimestamp": "1:08:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/y5EmRr1O1h4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=y5EmRr1O1h4",
      "description": "Code - https://github.com/campusx-official/langchain-structured-output My Notes: https://learnwith.campusx.in/products#nav_bar In this video, we explore how to make LLMs interact with databases, APIs, and other systems using structured responses l..."
    },
    {
      "id": "ai-genai-8",
      "courseId": "ai-res-5",
      "videoIndex": 8,
      "title": "Output Parsers in LangChain | Generative AI using LangChain | Video 6 | CampusX",
      "durationTimestamp": "53:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/Op6PbJZ5b2Q/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Op6PbJZ5b2Q",
      "description": "Code - https://github.com/campusx-official/langchain-output-parsers My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-9",
      "courseId": "ai-res-5",
      "videoIndex": 9,
      "title": "Chains in LangChain | Generative AI using LangChain | Video 7 | CampusX",
      "durationTimestamp": "54:01",
      "thumbnailUrl": "https://i.ytimg.com/vi/5hjrPILA3-8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=5hjrPILA3-8",
      "description": "Code - https://github.com/campusx-official/langchain-chains My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-10",
      "courseId": "ai-res-5",
      "videoIndex": 10,
      "title": "What are Runnables in LangChain | Generative AI using LangChain | Video 8 | CampusX",
      "durationTimestamp": "1:16:22",
      "thumbnailUrl": "https://i.ytimg.com/vi/u3b-W1NgYa4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=u3b-W1NgYa4",
      "description": "Code - https://colab.research.google.com/drive/1gv3e-OfHCi6IuVBVR7xWmrcVl6gHsydv?usp=sharing https://colab.research.google.com/drive/1P11hpAPtjr0oIiqQ5pNsdnMxmascdbBY?usp=sharing Github: https://github.com/campusx-official/langchain-runnables My N..."
    },
    {
      "id": "ai-genai-11",
      "courseId": "ai-res-5",
      "videoIndex": 11,
      "title": "Langchain Runnables - Part 2 | Generative AI using LangChain | Video 9 | CampusX",
      "durationTimestamp": "54:26",
      "thumbnailUrl": "https://i.ytimg.com/vi/47nc0n-e4_w/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=47nc0n-e4_w",
      "description": "Code: https://github.com/campusx-official/langchain-runnables My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-12",
      "courseId": "ai-res-5",
      "videoIndex": 12,
      "title": "Document Loaders in LangChain |  Generative AI using LangChain | Video 10 | CampusX",
      "durationTimestamp": "56:44",
      "thumbnailUrl": "https://i.ytimg.com/vi/bL92ALSZ2Cg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=bL92ALSZ2Cg",
      "description": "Code - https://github.com/campusx-official/langchain-document-loaders/ Relevant Docs: https://python.langchain.com/docs/concepts/document_loaders/ My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-13",
      "courseId": "ai-res-5",
      "videoIndex": 13,
      "title": "Text Splitters in LangChain | Generative AI using LangChain | Video 11 | CampusX",
      "durationTimestamp": "59:01",
      "thumbnailUrl": "https://i.ytimg.com/vi/SEWS9P4ODmc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=SEWS9P4ODmc",
      "description": "Code - https://github.com/campusx-official/langchain-text-splitters Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes"
    },
    {
      "id": "ai-genai-14",
      "courseId": "ai-res-5",
      "videoIndex": 14,
      "title": "Vector Stores in LangChain | Generative AI using LangChain | Video 12 | CampusX",
      "durationTimestamp": "50:31",
      "thumbnailUrl": "https://i.ytimg.com/vi/k13WK0bxQP0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=k13WK0bxQP0",
      "description": "Code - https://colab.research.google.com/drive/1VwOywJ9LPSIpKWKj9vueVoexSCzGHXNC?usp=sharing My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-15",
      "courseId": "ai-res-5",
      "videoIndex": 15,
      "title": "Retrievers in LangChain | Generative AI using LangChain | Video 13 | CampusX",
      "durationTimestamp": "51:10",
      "thumbnailUrl": "https://i.ytimg.com/vi/pJdMxwXBsk0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=pJdMxwXBsk0",
      "description": "Code - https://colab.research.google.com/drive/1vuuIYmJeiRgFHsH-ibH_NUFjtdc5D9P6?usp=sharing Documentation - https://python.langchain.com/docs/integrations/retrievers/ My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-16",
      "courseId": "ai-res-5",
      "videoIndex": 16,
      "title": "Retrieval Augmented Generation | What is RAG | How does RAG Work | RAG Explained | CampusX",
      "durationTimestamp": "59:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/X0btK9X0Xnk/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=X0btK9X0Xnk",
      "description": "In this video, you'll get a clear explanation of RAG \u2014 a powerful technique that combines retrieval and generation to improve the performance of large language models. We\u2019ll break down: What RAG is? Why it matters? How it works step by step? My No..."
    },
    {
      "id": "ai-genai-17",
      "courseId": "ai-res-5",
      "videoIndex": 17,
      "title": "YouTube Chatbot using LangChain | Building a RAG system in LangChain  | Video 15 | CampusX",
      "durationTimestamp": "46:15",
      "thumbnailUrl": "https://i.ytimg.com/vi/J5_-l7WIO_w/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=J5_-l7WIO_w",
      "description": "Code - https://colab.research.google.com/drive/1pat55z_iiLqzInsLi3sWS2wekFCXprQW?usp=sharing My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-18",
      "courseId": "ai-res-5",
      "videoIndex": 18,
      "title": "Tools in LangChain | Generative AI using LangChain | Video 16 | CampusX",
      "durationTimestamp": "45:16",
      "thumbnailUrl": "https://i.ytimg.com/vi/etnLX7m2MiA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=etnLX7m2MiA",
      "description": "Code - https://colab.research.google.com/drive/1GHHGsDFB5266Cc0xDsZ6OWzkB5GGSxFW?usp=sharing My Notes: https://learnwith.campusx.in/products#nav_bar Documentation - https://python.langchain.com/docs/integrations/tools/"
    },
    {
      "id": "ai-genai-19",
      "courseId": "ai-res-5",
      "videoIndex": 19,
      "title": "Tool Calling in LangChain | Generative AI using LangChain | Video 17 | CampusX",
      "durationTimestamp": "58:47",
      "thumbnailUrl": "https://i.ytimg.com/vi/EzYaFF7ahKw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=EzYaFF7ahKw",
      "description": "Code - https://colab.research.google.com/drive/1-xMYU9ExZqoySEX-XHAvEaE17PCWvc9H?usp=sharing My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-20",
      "courseId": "ai-res-5",
      "videoIndex": 20,
      "title": "Building end-to-end AI Agent in LangChain | Generative AI using LangChain | Video 18 | CampusX",
      "durationTimestamp": "1:12:47",
      "thumbnailUrl": "https://i.ytimg.com/vi/gm_lQG8fYjI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=gm_lQG8fYjI",
      "description": "Code - https://colab.research.google.com/drive/1O7cdBtiP_GNXgL9Iz4LPzYfvTKtMtv25?usp=sharing My Notes: https://learnwith.campusx.in/products#nav_bar"
    },
    {
      "id": "ai-genai-21",
      "courseId": "ai-res-5",
      "videoIndex": 21,
      "title": "Ollama Masterclass 2026: Run Powerful Local LLMs with Ollama (3-Hour Full Course) | CampusX",
      "durationTimestamp": "2:49:41",
      "thumbnailUrl": "https://i.ytimg.com/vi/YcAYmIFtA0o/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=YcAYmIFtA0o",
      "description": "Github: https://github.com/campusx-official/Ollama-Youtube Discount Offer: https://learnwith.campusx.in/courses/GenAI-using-Ollama-68eec843d5d88122b615c7f5 This comprehensive masterclass provides a deep dive into Ollama and the landscape of Open S..."
    }
  ],
  "ai-res-7": [
    {
      "id": "ai-agentic-1",
      "courseId": "ai-res-7",
      "videoIndex": 1,
      "title": "Agentic AI using LangGraph | New Playlist | LangGraph Tutorial",
      "durationTimestamp": "16:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/yC36gN-rqjo/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=yC36gN-rqjo",
      "description": "This playlist is your hands-on guide to building agentic AI systems using LangGraph\u2014a powerful framework for managing multi-step, multi-agent workflows. You\u2019ll learn how to: Understand the core ideas behind agentic workflows Use LangGraph to defin..."
    },
    {
      "id": "ai-agentic-2",
      "courseId": "ai-res-7",
      "videoIndex": 2,
      "title": "Generative AI vs Agentic AI | Agentic AI using LangGraph | Video 1 | CampusX",
      "durationTimestamp": "1:02:44",
      "thumbnailUrl": "https://i.ytimg.com/vi/xdA0pGDiUPE/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=xdA0pGDiUPE",
      "description": "In this video, we break down the key difference between Generative AI and Agentic AI\u2014and why it matters. You\u2019ll learn: What Generative AI does (text, images, code) What makes Agentic AI different (goals, memory, decisions) Real-world use cases of ..."
    },
    {
      "id": "ai-agentic-3",
      "courseId": "ai-res-7",
      "videoIndex": 3,
      "title": "What is Agentic AI? | Agentic AI using LangGraph | Video 2 | CampusX",
      "durationTimestamp": "1:00:25",
      "thumbnailUrl": "https://i.ytimg.com/vi/GWnSsjT4V68/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=GWnSsjT4V68",
      "description": "This video explains what Agentic AI really means\u2014and how it goes beyond traditional Generative AI. You\u2019ll learn: The core idea behind Agentic AI: autonomous decision-making How agents use memory, tools, and goals to act Why this matters for real-w..."
    },
    {
      "id": "ai-agentic-4",
      "courseId": "ai-res-7",
      "videoIndex": 4,
      "title": "LangChain Vs LangGraph | Agentic AI using LangGraph | Video 3 | CampusX",
      "durationTimestamp": "1:27:29",
      "thumbnailUrl": "https://i.ytimg.com/vi/31qyMKNB2RA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=31qyMKNB2RA",
      "description": "This video walks you through the key concepts of building automated, agentic workflows using LangGraph. We cover what LangGraph is, how it\u2019s used, and dive deep into topics like control flow, state management, event-driven execution, fault toleran..."
    },
    {
      "id": "ai-agentic-5",
      "courseId": "ai-res-7",
      "videoIndex": 5,
      "title": "LangGraph Core Concepts | Agentic AI using LangGraph | Video 4 | CampusX",
      "durationTimestamp": "51:52",
      "thumbnailUrl": "https://i.ytimg.com/vi/D5KhiCDM9XQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=D5KhiCDM9XQ",
      "description": "This video breaks down the key building blocks of LangGraph. You\u2019ll learn how to design and manage LLM workflows using concepts like prompt chaining, routing, parallel execution, and graph-based orchestration. We cover: How LangGraph structures wo..."
    },
    {
      "id": "ai-agentic-6",
      "courseId": "ai-res-7",
      "videoIndex": 6,
      "title": "Sequential Workflows in LangGraph | Agentic AI using LangGraph | Video 5 | CampusX",
      "durationTimestamp": "49:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/bAWujyAl1Kk/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=bAWujyAl1Kk",
      "description": "This video shows you how to build sequential workflows using LangGraph, step by step. You\u2019ll start from installation, build your first simple workflow, and then move on to LLM-based workflows with prompt chaining. What\u2019s covered: Setting up LangGr..."
    },
    {
      "id": "ai-agentic-7",
      "courseId": "ai-res-7",
      "videoIndex": 7,
      "title": "Parallel Workflows in LangGraph | Agentic AI using LangGraph | Video 6 | CampusX",
      "durationTimestamp": "59:29",
      "thumbnailUrl": "https://i.ytimg.com/vi/O6ryuSpqdOw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=O6ryuSpqdOw",
      "description": "This video teaches you how to build parallel workflows using LangGraph. You\u2019ll learn how to run multiple tasks at the same time, manage branching logic, and combine results effectively. What\u2019s covered: How to structure parallel tasks in LangGraph ..."
    },
    {
      "id": "ai-agentic-8",
      "courseId": "ai-res-7",
      "videoIndex": 8,
      "title": "Conditional Workflows in LangGraph | Agentic AI using LangGraph | Video 7 | CampusX",
      "durationTimestamp": "47:38",
      "thumbnailUrl": "https://i.ytimg.com/vi/I-dvZqTz-Wc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=I-dvZqTz-Wc",
      "description": "This video shows you how to build conditional workflows using LangGraph\u2014where the next step depends on specific outcomes or decisions. What\u2019s covered: Designing workflows with branching logic Handling quality evaluation (QE) checks Using LLM outpu..."
    },
    {
      "id": "ai-agentic-9",
      "courseId": "ai-res-7",
      "videoIndex": 9,
      "title": "Iterative Workflows in LangGraph | Agentic AI using LangGraph | Video 8 | CampusX",
      "durationTimestamp": "37:14",
      "thumbnailUrl": "https://i.ytimg.com/vi/7CbSqrovcsE/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=7CbSqrovcsE",
      "description": "Code - https://github.com/campusx-official/langgraph-tutorials"
    },
    {
      "id": "ai-agentic-10",
      "courseId": "ai-res-7",
      "videoIndex": 10,
      "title": "How to build a Chatbot using LangGraph",
      "durationTimestamp": "36:38",
      "thumbnailUrl": "https://i.ytimg.com/vi/51Ve2tE3Zns/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=51Ve2tE3Zns",
      "description": "Code - https://github.com/campusx-official/langgraph-tutorials"
    },
    {
      "id": "ai-agentic-11",
      "courseId": "ai-res-7",
      "videoIndex": 11,
      "title": "Persistence in LangGraph | Time Travel in LangGraph | CampusX",
      "durationTimestamp": "58:14",
      "thumbnailUrl": "https://i.ytimg.com/vi/_IPP7_Bi8uA/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=_IPP7_Bi8uA",
      "description": "Code - https://github.com/campusx-official/langgraph-tutorials"
    },
    {
      "id": "ai-agentic-12",
      "courseId": "ai-res-7",
      "videoIndex": 12,
      "title": "Building a Chatbot with UI in LangGraph & Streamlit | CampusX",
      "durationTimestamp": "32:28",
      "thumbnailUrl": "https://i.ytimg.com/vi/voZAgDmO-rk/sddefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=voZAgDmO-rk",
      "description": "Code -  https://github.com/campusx-official/chatbot-in-langgraph"
    },
    {
      "id": "ai-agentic-13",
      "courseId": "ai-res-7",
      "videoIndex": 13,
      "title": "Streaming in LangGraph | CampusX",
      "durationTimestamp": "25:00",
      "thumbnailUrl": "https://i.ytimg.com/vi/D1PcZaeQ2eg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=D1PcZaeQ2eg",
      "description": "Code - https://github.com/campusx-official/chatbot-in-langgraph"
    },
    {
      "id": "ai-agentic-14",
      "courseId": "ai-res-7",
      "videoIndex": 14,
      "title": "How to build a Resume Chat feature like ChatGPT? | CampusX",
      "durationTimestamp": "39:40",
      "thumbnailUrl": "https://i.ytimg.com/vi/N2nVG2MGWJ8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=N2nVG2MGWJ8",
      "description": "Code - https://github.com/campusx-official/chatbot-in-langgraph"
    },
    {
      "id": "ai-agentic-15",
      "courseId": "ai-res-7",
      "videoIndex": 15,
      "title": "LangGraph + SQLite | Chatbot with Database Integration | CampusX",
      "durationTimestamp": "28:48",
      "thumbnailUrl": "https://i.ytimg.com/vi/c6a47iX5JkU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=c6a47iX5JkU",
      "description": "Code - https://github.com/campusx-official/chatbot-in-langgraph"
    },
    {
      "id": "ai-agentic-16",
      "courseId": "ai-res-7",
      "videoIndex": 16,
      "title": "LangSmith Crash Course | LangSmith Tutorial for Beginners | Observability in GenAI | CampusX",
      "durationTimestamp": "2:07:40",
      "thumbnailUrl": "https://i.ytimg.com/vi/4FFspU4riHk/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=4FFspU4riHk",
      "description": "Code - https://github.com/campusx-official/langsmith-masterclass Additional Code: OPENAI_API_KEY = '[REDACTED]'"
    },
    {
      "id": "ai-agentic-17",
      "courseId": "ai-res-7",
      "videoIndex": 17,
      "title": "Observability in LangGraph | LangSmith Integration with LangGraph",
      "durationTimestamp": "21:40",
      "thumbnailUrl": "https://i.ytimg.com/vi/ikzN6byFNWw/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=ikzN6byFNWw",
      "description": "Code - https://github.com/campusx-official/chatbot-in-langgraph LangSmith Video Link - https://youtu.be/4FFspU4riHk Additional Code: OPENAI_API_KEY = '[REDACTED]'"
    },
    {
      "id": "ai-agentic-18",
      "courseId": "ai-res-7",
      "videoIndex": 18,
      "title": "Tools in LangGraph | Agentic AI using LangGraph | CampusX",
      "durationTimestamp": "34:20",
      "thumbnailUrl": "https://i.ytimg.com/vi/_UuUigoM9MA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=_UuUigoM9MA",
      "description": "Code - https://github.com/campusx-official/chatbot-in-langgraph"
    },
    {
      "id": "ai-agentic-19",
      "courseId": "ai-res-7",
      "videoIndex": 19,
      "title": "How to build MCP Client using LangGraph | Agentic AI using LangGraph | CampusX",
      "durationTimestamp": "44:31",
      "thumbnailUrl": "https://i.ytimg.com/vi/yZGjVA4uDc4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=yZGjVA4uDc4",
      "description": "Code - https://github.com/campusx-official/chatbot-in-langgraph https://github.com/campusx-official/mcp-client-langgraph In this video we continue the LangGraph Agentic AI playlist and implement MCP (Model Context Protocol) in LangGraph. First we ..."
    },
    {
      "id": "ai-agentic-20",
      "courseId": "ai-res-7",
      "videoIndex": 20,
      "title": "RAG using LangGraph | Agentic AI using LangGraph | CampusX",
      "durationTimestamp": "37:12",
      "thumbnailUrl": "https://i.ytimg.com/vi/E1qP9Xsnmik/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=E1qP9Xsnmik",
      "description": "Code - https://github.com/campusx-official/langgraph-tutorials Code - https://github.com/campusx-official/chatbot-in-langgraph RAG for beginners: https://youtu.be/X0btK9X0Xnk Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes This..."
    },
    {
      "id": "ai-agentic-21",
      "courseId": "ai-res-7",
      "videoIndex": 21,
      "title": "Human in the loop (HITL) using LangGraph | CampusX",
      "durationTimestamp": "40:04",
      "thumbnailUrl": "https://i.ytimg.com/vi/xxqZzVZ4gE0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=xxqZzVZ4gE0",
      "description": "Code - https://github.com/campusx-official/langgraph-tutorials In this video, we explore Human-in-the-Loop (HITL)\u2014one of the most important concepts for building safe, reliable, and production-ready agentic AI systems using LangGraph. We begin wit..."
    },
    {
      "id": "ai-agentic-22",
      "courseId": "ai-res-7",
      "videoIndex": 22,
      "title": "How to build Subgraphs in LangGraph",
      "durationTimestamp": "22:47",
      "thumbnailUrl": "https://i.ytimg.com/vi/wcHcocpAoX4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=wcHcocpAoX4",
      "description": "Code - https://github.com/campusx-official/langgraph-tutorials In this video, we dive deep into how to build and use subgraphs in LangGraph\u2014a critical concept for designing scalable, modular, and multi-agent GenAI systems. We start by understandin..."
    },
    {
      "id": "ai-agentic-23",
      "courseId": "ai-res-7",
      "videoIndex": 23,
      "title": "LLMs Don\u2019t Have Memory \u2014 So How Do They Remember?",
      "durationTimestamp": "57:44",
      "thumbnailUrl": "https://i.ytimg.com/vi/DcPKJrOF9Wo/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=DcPKJrOF9Wo",
      "description": "This video explains how memory works in GenAI systems and why it is essential for building chatbots and AI agents. It starts by showing why LLMs are stateless by default, then builds the idea of memory from first principles\u2014covering short-term mem..."
    },
    {
      "id": "ai-agentic-24",
      "courseId": "ai-res-7",
      "videoIndex": 24,
      "title": "How To Implement Short Term Memory Using LangGraph",
      "durationTimestamp": "52:46",
      "thumbnailUrl": "https://i.ytimg.com/vi/FSBkTI1QuvY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=FSBkTI1QuvY",
      "description": "In this video, we continue the Agentic AI using LangGraph series by learning how to implement short-term memory in LLM-based systems. The video explains why LLMs are stateless, how short-term memory works using conversation history, and how to imp..."
    },
    {
      "id": "ai-agentic-25",
      "courseId": "ai-res-7",
      "videoIndex": 25,
      "title": "Long Term Memory in LangGraph",
      "durationTimestamp": "1:05:35",
      "thumbnailUrl": "https://i.ytimg.com/vi/KrXBcokM3Tc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=KrXBcokM3Tc",
      "description": "Code - https://github.com/campusx-official/memory-in-llms Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes"
    },
    {
      "id": "ai-agentic-26",
      "courseId": "ai-res-7",
      "videoIndex": 26,
      "title": "This AI Agent Plans, Researches & Writes Blogs Automatically using LangGraph | Agentic AI Project",
      "durationTimestamp": "1:20:04",
      "thumbnailUrl": "https://i.ytimg.com/vi/Ou_v9lk0rxg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Ou_v9lk0rxg",
      "description": "In this video, we build a real AI agent using LangGraph, going beyond simple prompts to design a planning-based, production-style agent system that plans before execution, decides when internet research is required, breaks tasks into parallel subt..."
    },
    {
      "id": "ai-agentic-27",
      "courseId": "ai-res-7",
      "videoIndex": 27,
      "title": "Advanced RAG: How Corrective RAG (CRAG) Solves Traditional RAG Problems | CampusX",
      "durationTimestamp": "1:15:09",
      "thumbnailUrl": "https://i.ytimg.com/vi/41XDn81nR5c/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=41XDn81nR5c",
      "description": "Traditional RAG systems often suffer from \"blind trust,\" where they generate answers based on irrelevant retrieved documents, leading to hallucinations. In this video, we explore Corrective RAG (CRAG), a robust architecture that evaluates the qual..."
    },
    {
      "id": "ai-agentic-28",
      "courseId": "ai-res-7",
      "videoIndex": 28,
      "title": "Self-RAG Tutorial: How to Make Your AI Fact-Check Itself | Advanced RAG | CampusX",
      "durationTimestamp": "1:08:40",
      "thumbnailUrl": "https://i.ytimg.com/vi/BbO_XaEjzaA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=BbO_XaEjzaA",
      "description": "In this video, we dive deep into Self-RAG (Self-Reflective Retrieval-Augmented Generation), a powerful technique designed to fix the biggest flaws in traditional RAG systems: unnecessary retrievals, irrelevant documents, and hallucinations Resourc..."
    }
  ],
  "ai-res-10": [
    {
      "id": "ai-mcp-1",
      "courseId": "ai-res-10",
      "videoIndex": 1,
      "title": "Model Context Protocol | Mini Playlist | MCP Trilogy | CampusX",
      "durationTimestamp": "37:07",
      "thumbnailUrl": "https://i.ytimg.com/vi/3_TN1i3MTEU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=3_TN1i3MTEU",
      "description": "In this video, we introduce a brand-new mini-series on the Model Context Protocol (MCP)\u2014a powerful framework that connects AI tools and workflows seamlessly. The trilogy will cover: 1\ufe0f\u20e3 The Why \u2013 Why MCP was created and the problems it solves. 2\ufe0f\u20e3..."
    },
    {
      "id": "ai-mcp-2",
      "courseId": "ai-res-10",
      "videoIndex": 2,
      "title": "Model Context Protocol - The Why | MCP Trilogy | CampusX",
      "durationTimestamp": "52:01",
      "thumbnailUrl": "https://i.ytimg.com/vi/Zmy439spZB4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Zmy439spZB4",
      "description": "Link for slides - https://docs.google.com/presentation/d/1OQzPhi73EUUbYXrIkOwGLnQYTSK8xU8T_zrtZcfgN0Q/edit?usp=drivesdk"
    },
    {
      "id": "ai-mcp-3",
      "courseId": "ai-res-10",
      "videoIndex": 3,
      "title": "MCP Architecture | Model Context Protocol Architecture | CampusX",
      "durationTimestamp": "1:17:09",
      "thumbnailUrl": "https://i.ytimg.com/vi/nQa31xdXbGk/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=nQa31xdXbGk",
      "description": "In this video, we dive deep into the Model Context Protocol (MCP) Architecture and break it down from first principles. We\u2019ll cover: The core building blocks of MCP \u2192 Host, Client, and Server How they communicate and why the Client is essential Re..."
    },
    {
      "id": "ai-mcp-4",
      "courseId": "ai-res-10",
      "videoIndex": 4,
      "title": "The MCP Lifecycle | MCP Trilogy | CampusX",
      "durationTimestamp": "55:05",
      "thumbnailUrl": "https://i.ytimg.com/vi/sBHeMcxupmE/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=sBHeMcxupmE",
      "description": "In this video, we continue our MCP (Model Context Protocol) playlist. So far, we\u2019ve covered why MCP is needed and its architecture in detail. Today, we\u2019ll move one step further and explore a very important concept \u2013 the MCP Life Cycle. You\u2019ll lear..."
    },
    {
      "id": "ai-mcp-5",
      "courseId": "ai-res-10",
      "videoIndex": 5,
      "title": "Model Context Protocol | The How | How to connect MCP Servers to Claude Desktop | CampusX",
      "durationTimestamp": "46:17",
      "thumbnailUrl": "https://i.ytimg.com/vi/y-uPv3ltOTY/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=y-uPv3ltOTY",
      "description": "Download Claude Desktop: https://claude.ai/download MANIM MPC Server: https://github.com/abhiemj/manim-mcp-server Twitter MCP Server: https://github.com/EnesCinr/twitter-mcp Weather MCP Server: https://github.com/adhikasp/mcp-weather New MCP Serve..."
    },
    {
      "id": "ai-mcp-6",
      "courseId": "ai-res-10",
      "videoIndex": 6,
      "title": "How to Build Local MCP Servers | MCP Trilogy | CampusX",
      "durationTimestamp": "1:12:11",
      "thumbnailUrl": "https://i.ytimg.com/vi/tc2oOznpdE0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=tc2oOznpdE0",
      "description": "Code - https://github.com/campusx-official/expense-tracker-mcp-server Quick Revision -  https://docs.google.com/document/d/1xLHPVi07Jy3vZUjDNnC7BivUpN1Ro0aYDxP09yD3pzs/edit?usp=sharing In this video, we continue our MCP (Model Context Protocol) pl..."
    },
    {
      "id": "ai-mcp-7",
      "courseId": "ai-res-10",
      "videoIndex": 7,
      "title": "How to Build & Deploy Remote MCP Servers | MCP Trilogy | CampusX",
      "durationTimestamp": "45:49",
      "thumbnailUrl": "https://i.ytimg.com/vi/GF7-ZzUausU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=GF7-ZzUausU",
      "description": "Code - https://github.com/campusx-official/test-remote-mcp-server Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Quick Revision -  https://docs.google.com/document/d/1QyQKI8s23L3QQQwaq6sabsw4dqbYJngXswK-94tsL78/edit?usp=sharin..."
    },
    {
      "id": "ai-mcp-8",
      "courseId": "ai-res-10",
      "videoIndex": 8,
      "title": "How to build MCP Clients | MCP Trilogy | CampusX",
      "durationTimestamp": "40:00",
      "thumbnailUrl": "https://i.ytimg.com/vi/o4ajsc-tSBc/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=o4ajsc-tSBc",
      "description": "In this video, we learn how to build your own MCP client and connect it to multiple MCP servers \u2014 including a local Math server, a remote Expense Tracker server, and even a Manim animation server. We go step-by-step through the setup, tool-calls, ..."
    }
  ],
  "ai-res-14": [
    {
      "id": "ai-fastapi-1",
      "courseId": "ai-res-14",
      "videoIndex": 1,
      "title": "What is an API? | Introduction to APIs | FAST API for Machine Learning | CampusX",
      "durationTimestamp": "46:37",
      "thumbnailUrl": "https://i.ytimg.com/vi/WJKsPchji0Q/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=WJKsPchji0Q",
      "description": "New to APIs or wondering what FastAPI is all about? This playlist breaks it down in simple terms. We\u2019ll start with the basics\u2014what an API is, why it matters, and how it connects different apps. Then, we\u2019ll dive into FastAPI, a powerful Python fram..."
    },
    {
      "id": "ai-fastapi-2",
      "courseId": "ai-res-14",
      "videoIndex": 2,
      "title": "FastAPI Philosophy | How to setup FastAPI | Installation and Code Demo | Video 2 | CampusX",
      "durationTimestamp": "42:07",
      "thumbnailUrl": "https://i.ytimg.com/vi/lXx-_1r0Uss/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=lXx-_1r0Uss",
      "description": "In this video, we cover three key things to get you started with FastAPI: The philosophy behind FastAPI \u2014 why it exists and what makes it different How to set it up properly on your machine A quick demo to show how simple it is to write your first..."
    },
    {
      "id": "ai-fastapi-3",
      "courseId": "ai-res-14",
      "videoIndex": 3,
      "title": "HTTP Methods in FastAPI | Video 3 | CampusX",
      "durationTimestamp": "27:01",
      "thumbnailUrl": "https://i.ytimg.com/vi/O8KrViWNhOM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=O8KrViWNhOM",
      "description": "Code - https://github.com/campusx-official/fastapi-demo-api Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Advanced Course: https://learnwith.campusx.in/courses/FastAPI-6873cb2075f40c2715c809fe My Notes: https://learnwith.camp..."
    },
    {
      "id": "ai-fastapi-4",
      "courseId": "ai-res-14",
      "videoIndex": 4,
      "title": "Path & Query Params in FastAPI | Video 4 | CampusX",
      "durationTimestamp": "41:12",
      "thumbnailUrl": "https://i.ytimg.com/vi/VVVKEfhXCQ4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=VVVKEfhXCQ4",
      "description": "Code - https://github.com/campusx-official/fastapi-demo-api Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Advanced Course: https://learnwith.campusx.in/courses/FastAPI-6873cb2075f40c2715c809fe My Notes: https://learnwith.camp..."
    },
    {
      "id": "ai-fastapi-5",
      "courseId": "ai-res-14",
      "videoIndex": 5,
      "title": "Pydantic Crash Course | Data Validation in Python | CampusX",
      "durationTimestamp": "1:25:31",
      "thumbnailUrl": "https://i.ytimg.com/vi/lRArylZCeOs/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=lRArylZCeOs",
      "description": "Code - https://github.com/campusx-official/pydantic-crash-course Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes My Notes: https://learnwith.campusx.in/products#nav_bar Pydantic helps you define clear, type-safe data models and..."
    },
    {
      "id": "ai-fastapi-6",
      "courseId": "ai-res-14",
      "videoIndex": 6,
      "title": "Post Request in FastAPI | What is Request Body? | Video 5 | CampusX",
      "durationTimestamp": "35:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/sw8V7mLl3OI/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=sw8V7mLl3OI",
      "description": "Code - https://github.com/campusx-official/fastapi-demo-api/ Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Advanced Course: https://learnwith.campusx.in/courses/FastAPI-6873cb2075f40c2715c809fe My Notes: https://learnwith.cam..."
    },
    {
      "id": "ai-fastapi-7",
      "courseId": "ai-res-14",
      "videoIndex": 7,
      "title": "PUT & DELETE in FastAPI | Video 6 | CampusX",
      "durationTimestamp": "31:11",
      "thumbnailUrl": "https://i.ytimg.com/vi/XVu22pTwWE8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=XVu22pTwWE8",
      "description": "Code - https://github.com/campusx-official/fastapi-demo-api Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Advanced Course: https://learnwith.campusx.in/courses/FastAPI-6873cb2075f40c2715c809fe My Notes: https://learnwith.camp..."
    },
    {
      "id": "ai-fastapi-8",
      "courseId": "ai-res-14",
      "videoIndex": 8,
      "title": "Serving ML Models with FastAPI | Video 7 | CampusX",
      "durationTimestamp": "46:37",
      "thumbnailUrl": "https://i.ytimg.com/vi/JdDoMi_vqbM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=JdDoMi_vqbM",
      "description": "Code - https://github.com/campusx-official/fastapi-demo-api Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Advanced Course: https://learnwith.campusx.in/courses/FastAPI-6873cb2075f40c2715c809fe My Notes: https://learnwith.camp..."
    },
    {
      "id": "ai-fastapi-9",
      "courseId": "ai-res-14",
      "videoIndex": 9,
      "title": "Improving the FastAPI API | Video 8 | CampusX",
      "durationTimestamp": "40:35",
      "thumbnailUrl": "https://i.ytimg.com/vi/M17qwKnmG38/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=M17qwKnmG38",
      "description": "Code - https://github.com/campusx-official/insurance-premium-prediction-fastapi Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Advanced Course: https://learnwith.campusx.in/courses/FastAPI-6873cb2075f40c2715c809fe My Notes: ht..."
    },
    {
      "id": "ai-fastapi-10",
      "courseId": "ai-res-14",
      "videoIndex": 10,
      "title": "Docker for Machine Learning | Docker Crash Course | CampusX",
      "durationTimestamp": "1:26:45",
      "thumbnailUrl": "https://i.ytimg.com/vi/GToyQTGDOS4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=GToyQTGDOS4",
      "description": "Notes - https://drive.google.com/file/d/1AGcGb49pU55Dm2B7aBRBgaTKMNrBIXm6/view?usp=sharing ML project link - https://github.com/campusx-official/laptop-price-predictor-regression-project Docker for ML Course: https://learnwith.campusx.in/courses/D..."
    },
    {
      "id": "ai-fastapi-11",
      "courseId": "ai-res-14",
      "videoIndex": 11,
      "title": "FastAPI + Docker Tutorial for Beginners | How to Dockerize a FastAPI API Application | CampusX",
      "durationTimestamp": "19:22",
      "thumbnailUrl": "https://i.ytimg.com/vi/jlLs6hfAga4/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=jlLs6hfAga4",
      "description": "Docker Tutorial - https://www.youtube.com/watch?v=GToyQTGDOS4 Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Code - https://github.com/campusx-official/insurance-premium-prediction-fastapi Docker Image Link - https://hub.docke..."
    },
    {
      "id": "ai-fastapi-12",
      "courseId": "ai-res-14",
      "videoIndex": 12,
      "title": "How to Deploy a FastAPI API on AWS | Video 10 | CampusX",
      "durationTimestamp": "18:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/X0lnToYN21k/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=X0lnToYN21k",
      "description": "Code - https://github.com/campusx-official/fastapi-demo-api Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes Instructions: 1. create an EC2 instance 2. Connect to the EC2 instance 3. Run the following commands a. sudo apt-get up..."
    },
    {
      "id": "ai-fastapi-13",
      "courseId": "ai-res-14",
      "videoIndex": 13,
      "title": "FastAPI Course Launch",
      "durationTimestamp": "12:22",
      "thumbnailUrl": "https://i.ytimg.com/vi/VjPrWc0NQP0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=VjPrWc0NQP0",
      "description": "Link - https://learnwith.campusx.in/courses/FastAPI-6873cb2075f40c2715c809fe Notes: https://learnwith.campusx.in/s/store/courses/YouTube%20Notes"
    }
  ],
  "ai-res-6": [
    {
      "id": "ai-tf-1",
      "courseId": "ai-res-6",
      "videoIndex": 1,
      "title": "Attention Mechanism in 1 video | Seq2Seq Networks | Encoder Decoder Architecture",
      "durationTimestamp": "41:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/rj5V6q6-XUM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=rj5V6q6-XUM",
      "description": "In this video, we introduce the importance of attention mechanisms, provide a quick overview of the encoder-decoder structure, and explain how the workflow functions. An attention mechanism is a key concept in the field of machine learning, partic..."
    },
    {
      "id": "ai-tf-2",
      "courseId": "ai-res-6",
      "videoIndex": 2,
      "title": "Bahdanau Attention Vs Luong Attention",
      "durationTimestamp": "52:33",
      "thumbnailUrl": "https://i.ytimg.com/vi/0hZT4_fHfNQ/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=0hZT4_fHfNQ",
      "description": "Bahdanau Attention and Luong Attention are two mechanisms used in the context of sequence-to-sequence models, especially in machine translation tasks. These attention mechanisms allow the model to focus on different parts of the input sequence whe..."
    },
    {
      "id": "ai-tf-3",
      "courseId": "ai-res-6",
      "videoIndex": 3,
      "title": "Introduction to Transformers | Transformers Part 1",
      "durationTimestamp": "1:00:05",
      "thumbnailUrl": "https://i.ytimg.com/vi/BjRVS2wTtcA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=BjRVS2wTtcA",
      "description": "Transformers are a powerful class of models in natural language processing and machine learning, revolutionizing various tasks. From attention mechanisms to self-attention, transformers have reshaped the landscape of deep learning. Introduced by V..."
    },
    {
      "id": "ai-tf-4",
      "courseId": "ai-res-6",
      "videoIndex": 4,
      "title": "What is Self Attention | Transformers Part 2 | CampusX",
      "durationTimestamp": "23:21",
      "thumbnailUrl": "https://i.ytimg.com/vi/XnGGmvpDLA0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=XnGGmvpDLA0",
      "description": "Self Attention is a mechanism that enables transformers to weigh the importance of different words in a sequence relative to each other. It allows the model to focus on relevant information, improving its ability to capture long-range dependencies..."
    },
    {
      "id": "ai-tf-5",
      "courseId": "ai-res-6",
      "videoIndex": 5,
      "title": "Self Attention in Transformers | Deep Learning | Simple Explanation with Code!",
      "durationTimestamp": "1:23:24",
      "thumbnailUrl": "https://i.ytimg.com/vi/-tCKPl_8Xb8/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=-tCKPl_8Xb8",
      "description": "Self Attention works by computing attention scores for each word in a sequence based on its relationship with every other word. These scores determine how much focus each word receives during processing, allowing the model to prioritize relevant i..."
    },
    {
      "id": "ai-tf-6",
      "courseId": "ai-res-6",
      "videoIndex": 6,
      "title": "Scaled Dot Product Attention | Why do we scale Self Attention?",
      "durationTimestamp": "50:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/r7mAt0iVqwo/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=r7mAt0iVqwo",
      "description": "Scaling Self Attention in Scaled Dot Product Attention is crucial for stabilizing training, optimizing dataset utilization, and improving the model's ability to focus on relevant information within sequences by standardizing the variance of dot pr..."
    },
    {
      "id": "ai-tf-7",
      "courseId": "ai-res-6",
      "videoIndex": 7,
      "title": "Self Attention Geometric Intuition | How to Visualize Self Attention | CampusX",
      "durationTimestamp": "20:52",
      "thumbnailUrl": "https://i.ytimg.com/vi/5ZgGuujZSbs/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=5ZgGuujZSbs",
      "description": "Visualizing Self Attention offers insights into how attention weights are computed and distributed across input tokens. By understanding the geometric interpretation, we can perceive how attention mechanisms dynamically focus on relevant informati..."
    },
    {
      "id": "ai-tf-8",
      "courseId": "ai-res-6",
      "videoIndex": 8,
      "title": "Why is Self Attention called \"Self\"? | Self Attention Vs Luong Attention in Depth Lecture | CampusX",
      "durationTimestamp": "22:35",
      "thumbnailUrl": "https://i.ytimg.com/vi/o4ZVA0TuDRg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=o4ZVA0TuDRg",
      "description": "The term \"self\" in \"self-attention\" refers to the fact that the attention mechanism is applied to the same sequence or input, rather than relating an input to an output sequence. In other words, self-attention allows the model to learn about the r..."
    },
    {
      "id": "ai-tf-9",
      "courseId": "ai-res-6",
      "videoIndex": 9,
      "title": "What is Multi-head Attention in Transformers | Multi-head Attention v Self Attention | Deep Learning",
      "durationTimestamp": "38:27",
      "thumbnailUrl": "https://i.ytimg.com/vi/bX2QwpjsmuA/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=bX2QwpjsmuA",
      "description": "Multi-head Attention enhances the expressiveness and representational capacity of Transformers by allowing the model to attend to different parts of the input data simultaneously. By utilizing multiple attention heads, the model can capture divers..."
    },
    {
      "id": "ai-tf-10",
      "courseId": "ai-res-6",
      "videoIndex": 10,
      "title": "Positional Encoding in Transformers | Deep Learning | CampusX",
      "durationTimestamp": "1:13:15",
      "thumbnailUrl": "https://i.ytimg.com/vi/GeoQBNNqIbM/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=GeoQBNNqIbM",
      "description": "Positional Encoding is a technique used in transformers to inject information about the position of tokens in a sequence. Since transformers lack inherent sequence order awareness, positional encodings enable the model to capture the order of word..."
    },
    {
      "id": "ai-tf-11",
      "courseId": "ai-res-6",
      "videoIndex": 11,
      "title": "Layer Normalization in Transformers | Layer Norm Vs Batch Norm",
      "durationTimestamp": "46:57",
      "thumbnailUrl": "https://i.ytimg.com/vi/qti0QPdaelg/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=qti0QPdaelg",
      "description": "Layer Normalization is a technique used to stabilize and accelerate the training of transformers by normalizing the inputs across the features. It adjusts and scales the activations, ensuring consistent output distributions. This helps in reducing..."
    },
    {
      "id": "ai-tf-12",
      "courseId": "ai-res-6",
      "videoIndex": 12,
      "title": "Transformer Architecture | Part 1 Encoder Architecture | CampusX",
      "durationTimestamp": "54:58",
      "thumbnailUrl": "https://i.ytimg.com/vi/Vs87qcdm8l0/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=Vs87qcdm8l0",
      "description": "The Encoder in transformer architecture processes input sequences by applying layers of multi-head self-attention and feed-forward networks. Each layer consists of self-attention mechanisms followed by layer normalization and feed-forward neural n..."
    },
    {
      "id": "ai-tf-13",
      "courseId": "ai-res-6",
      "videoIndex": 13,
      "title": "Masked Self Attention | Masked Multi-head Attention in Transformer | Transformer Decoder",
      "durationTimestamp": "1:00:54",
      "thumbnailUrl": "https://i.ytimg.com/vi/m6onaKFzF94/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=m6onaKFzF94",
      "description": "Masked Multi-head Attention is used in transformer models to ensure that each token in a sequence only attends to previous tokens and itself, not future tokens. This masking is essential for autoregressive tasks like language generation, enabling ..."
    },
    {
      "id": "ai-tf-14",
      "courseId": "ai-res-6",
      "videoIndex": 14,
      "title": "Cross Attention in Transformers | 100 Days Of Deep Learning | CampusX",
      "durationTimestamp": "34:07",
      "thumbnailUrl": "https://i.ytimg.com/vi/smOnJtCevoU/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=smOnJtCevoU",
      "description": "Cross Attention is a mechanism in transformer models where the attention is applied between different sequences, typically between the output of one layer and the input of another. It allows the model to focus on relevant parts of the input sequen..."
    },
    {
      "id": "ai-tf-15",
      "courseId": "ai-res-6",
      "videoIndex": 15,
      "title": "Transformer Decoder Architecture | Deep Learning | CampusX",
      "durationTimestamp": "48:26",
      "thumbnailUrl": "https://i.ytimg.com/vi/DI2_hrAulYo/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=DI2_hrAulYo",
      "description": "The Decoder in a transformer architecture generates output sequences by attending to both the previous tokens (via masked self-attention) and the encoder\u2019s output (via cross-attention). Each decoder layer consists of multi-head self-attention, cro..."
    },
    {
      "id": "ai-tf-16",
      "courseId": "ai-res-6",
      "videoIndex": 16,
      "title": "Transformer Inference | How Inference is done in Transformer? | Deep Learning | CampusX",
      "durationTimestamp": "45:12",
      "thumbnailUrl": "https://i.ytimg.com/vi/FtsMOzlwxws/maxresdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=FtsMOzlwxws",
      "description": "Inference in transformers involves generating predictions from the trained model. During inference, the decoder predicts one token at a time, using previously generated tokens and attending to the encoder's output. The process continues iterativel..."
    }
  ],
  "ai-res-26": [
    {
      "id": "ai-stat-1",
      "courseId": "ai-res-26",
      "videoIndex": 1,
      "title": "Introduction & Statistics Overview (0:00:00)",
      "durationTimestamp": "0:35",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=0s",
      "description": "Introduction to statistics for data science and machine learning.",
      "startSeconds": 0
    },
    {
      "id": "ai-stat-2",
      "courseId": "ai-res-26",
      "videoIndex": 2,
      "title": "Descriptive Statistics (0:00:35)",
      "durationTimestamp": "2:10",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=35s",
      "description": "Core foundations of descriptive statistics, summarizing and organizing data.",
      "startSeconds": 35
    },
    {
      "id": "ai-stat-3",
      "courseId": "ai-res-26",
      "videoIndex": 3,
      "title": "Inferential Statistics (0:02:45)",
      "durationTimestamp": "1:46",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=165s",
      "description": "Introduction to inferential statistics, hypothesis testing, and sample conclusions.",
      "startSeconds": 165
    },
    {
      "id": "ai-stat-4",
      "courseId": "ai-res-26",
      "videoIndex": 4,
      "title": "What is Statistics (0:04:31)",
      "durationTimestamp": "2:23",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=271s",
      "description": "Formal definition of statistics and its role across science, industry, and AI.",
      "startSeconds": 271
    },
    {
      "id": "ai-stat-5",
      "courseId": "ai-res-26",
      "videoIndex": 5,
      "title": "Types of Statistics (0:06:54)",
      "durationTimestamp": "4:28",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=414s",
      "description": "Comparing descriptive vs inferential statistical paradigms.",
      "startSeconds": 414
    },
    {
      "id": "ai-stat-6",
      "courseId": "ai-res-26",
      "videoIndex": 6,
      "title": "Population and Sample (0:11:22)",
      "durationTimestamp": "3:11",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=682s",
      "description": "Understanding population parameters vs sample statistics.",
      "startSeconds": 682
    },
    {
      "id": "ai-stat-7",
      "courseId": "ai-res-26",
      "videoIndex": 7,
      "title": "Sampling Techniques (0:14:33)",
      "durationTimestamp": "10:00",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=873s",
      "description": "Simple random, stratified, systematic, and cluster sampling strategies.",
      "startSeconds": 873
    },
    {
      "id": "ai-stat-8",
      "courseId": "ai-res-26",
      "videoIndex": 8,
      "title": "What are Variables? (0:24:33)",
      "durationTimestamp": "6:21",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=1473s",
      "description": "Quantitative vs qualitative, discrete vs continuous variables.",
      "startSeconds": 1473
    },
    {
      "id": "ai-stat-9",
      "courseId": "ai-res-26",
      "videoIndex": 9,
      "title": "Variable Measurement Scales (0:30:54)",
      "durationTimestamp": "12:01",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=1854s",
      "description": "Nominal, ordinal, interval, and ratio scales of measurement.",
      "startSeconds": 1854
    },
    {
      "id": "ai-stat-10",
      "courseId": "ai-res-26",
      "videoIndex": 10,
      "title": "Mean, Median, Mode (0:42:55)",
      "durationTimestamp": "14:15",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=2575s",
      "description": "Measures of central tendency, skewed data, and when to use each measure.",
      "startSeconds": 2575
    },
    {
      "id": "ai-stat-11",
      "courseId": "ai-res-26",
      "videoIndex": 11,
      "title": "Measure of Dispersion (Variance & SD) (0:57:10)",
      "durationTimestamp": "10:55",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=3430s",
      "description": "Calculating variance, sample variance with Bessel's correction (n-1), and standard deviation.",
      "startSeconds": 3430
    },
    {
      "id": "ai-stat-12",
      "courseId": "ai-res-26",
      "videoIndex": 12,
      "title": "Percentiles and Quartiles (1:08:05)",
      "durationTimestamp": "7:30",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=4085s",
      "description": "Understanding percentiles, Q1, Q2 (median), Q3, and cumulative relative frequencies.",
      "startSeconds": 4085
    },
    {
      "id": "ai-stat-13",
      "courseId": "ai-res-26",
      "videoIndex": 13,
      "title": "Five Number Summary and Boxplot (1:15:35)",
      "durationTimestamp": "13:37",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=4535s",
      "description": "Min, Q1, Median, Q3, Max, IQR, and visual outlier detection via box plots.",
      "startSeconds": 4535
    },
    {
      "id": "ai-stat-14",
      "courseId": "ai-res-26",
      "videoIndex": 14,
      "title": "Gaussian and Normal Distribution (1:29:12)",
      "durationTimestamp": "27:28",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=5352s",
      "description": "Bell curve, empirical 68-95-99.7 rule, standard normal distribution, and Z-scores.",
      "startSeconds": 5352
    },
    {
      "id": "ai-stat-15",
      "courseId": "ai-res-26",
      "videoIndex": 15,
      "title": "Statistics Interview Questions (1:56:40)",
      "durationTimestamp": "20:30",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=7000s",
      "description": "Real-world data science interview questions on distributions and sampling.",
      "startSeconds": 7000
    },
    {
      "id": "ai-stat-16",
      "courseId": "ai-res-26",
      "videoIndex": 16,
      "title": "Finding Outliers in Python (2:17:10)",
      "durationTimestamp": "14:50",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=8230s",
      "description": "Hands-on Python implementation using IQR and Z-scores to detect and handle anomalies.",
      "startSeconds": 8230
    },
    {
      "id": "ai-stat-17",
      "courseId": "ai-res-26",
      "videoIndex": 17,
      "title": "Probability (Additive & Multiplicative) (2:32:00)",
      "durationTimestamp": "19:26",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=9120s",
      "description": "Independent events, mutually exclusive events, conditional probability, and Bayes rule.",
      "startSeconds": 9120
    },
    {
      "id": "ai-stat-18",
      "courseId": "ai-res-26",
      "videoIndex": 18,
      "title": "Permutations and Combinations (2:51:26)",
      "durationTimestamp": "4:56",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=10286s",
      "description": "Counting principles, factorials, permutations nPr, and combinations nCr.",
      "startSeconds": 10286
    },
    {
      "id": "ai-stat-19",
      "courseId": "ai-res-26",
      "videoIndex": 19,
      "title": "P-Value Fundamentals (2:56:22)",
      "durationTimestamp": "2:57",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=10582s",
      "description": "What p-value represents in hypothesis testing and evidence against null hypothesis.",
      "startSeconds": 10582
    },
    {
      "id": "ai-stat-20",
      "courseId": "ai-res-26",
      "videoIndex": 20,
      "title": "Hypothesis Testing & Confidence Intervals (2:59:19)",
      "durationTimestamp": "13:03",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=10759s",
      "description": "Null vs Alternative hypothesis, alpha significance levels, and two-tailed vs one-tailed tests.",
      "startSeconds": 10759
    },
    {
      "id": "ai-stat-21",
      "courseId": "ai-res-26",
      "videoIndex": 21,
      "title": "Type 1 and Type 2 Errors (3:12:22)",
      "durationTimestamp": "13:33",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=11542s",
      "description": "False positives (alpha), false negatives (beta), statistical power, and risk trade-offs.",
      "startSeconds": 11542
    },
    {
      "id": "ai-stat-22",
      "courseId": "ai-res-26",
      "videoIndex": 22,
      "title": "Confidence Interval In-Depth (3:25:55)",
      "durationTimestamp": "20:50",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=12355s",
      "description": "Point estimates, margin of error, critical values, and constructing confidence intervals.",
      "startSeconds": 12355
    },
    {
      "id": "ai-stat-23",
      "courseId": "ai-res-26",
      "videoIndex": 23,
      "title": "One-Sample Z-Test (3:46:45)",
      "durationTimestamp": "12:26",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=13605s",
      "description": "Conducting one-sample Z-tests when population variance is known.",
      "startSeconds": 13605
    },
    {
      "id": "ai-stat-24",
      "courseId": "ai-res-26",
      "videoIndex": 24,
      "title": "One-Sample T-Test (3:59:11)",
      "durationTimestamp": "7:21",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=14351s",
      "description": "Student's t-distribution, degrees of freedom, and testing with unknown population variance.",
      "startSeconds": 14351
    },
    {
      "id": "ai-stat-25",
      "courseId": "ai-res-26",
      "videoIndex": 25,
      "title": "Chi-Square Test (4:06:32)",
      "durationTimestamp": "15:13",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=14792s",
      "description": "Chi-Square goodness of fit test and test of independence for categorical variables.",
      "startSeconds": 14792
    },
    {
      "id": "ai-stat-26",
      "courseId": "ai-res-26",
      "videoIndex": 26,
      "title": "Inferential Statistics with Python (4:21:45)",
      "durationTimestamp": "2:52",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=15705s",
      "description": "Executing statistical tests using scipy.stats and interpreting results in Python.",
      "startSeconds": 15705
    },
    {
      "id": "ai-stat-27",
      "courseId": "ai-res-26",
      "videoIndex": 27,
      "title": "Covariance, Pearson & Spearman Correlation (4:24:37)",
      "durationTimestamp": "30:22",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=15877s",
      "description": "Direction vs strength of linear and monotonic relationships between variables.",
      "startSeconds": 15877
    },
    {
      "id": "ai-stat-28",
      "courseId": "ai-res-26",
      "videoIndex": 28,
      "title": "Deriving P-Values & Significance (4:54:59)",
      "durationTimestamp": "18:42",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=17699s",
      "description": "Deep dive into calculating and interpreting exact p-values in decision making.",
      "startSeconds": 17699
    },
    {
      "id": "ai-stat-29",
      "courseId": "ai-res-26",
      "videoIndex": 29,
      "title": "Distributions (Log-Normal, Pareto, Poisson) (5:13:41)",
      "durationTimestamp": "31:19",
      "thumbnailUrl": "https://i.ytimg.com/vi/LZzq1zSL1bs/hqdefault.jpg",
      "youtubeUrl": "https://www.youtube.com/watch?v=LZzq1zSL1bs&t=18821s",
      "description": "Log-normal, Pareto (Power Law), Binomial, Bernoulli, and Poisson distributions.",
      "startSeconds": 18821
    }
  ]
};
