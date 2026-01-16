import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Play, Users, Trophy, Clock, Star, Award, Target, BarChart3 } from 'lucide-react';

const MasterClassAcademy: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [activeLesson, setActiveLesson] = useState<{ courseId: number; moduleId: number } | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('completedModules');
    if (saved) {
      try {
        setCompletedModules(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to parse completed modules', e);
      }
    }
  }, []);

  const saveCompletedModules = (newSet: Set<string>) => {
    localStorage.setItem('completedModules', JSON.stringify(Array.from(newSet)));
  };

  // Mock data for courses
  const coursesData = [
    {
      id: 1,
      title: t('beginnerTrading'),
      subtitle: t('tradingFromScratch'),
      level: 'Beginner',
      duration: '8h',
      lessons: 24,
      icon: BookOpen,
      description: t('beginnerCourseDesc'),
      modules: [
        { id: 1, title: t('introductionToTrading'), duration: '30m', completed: true },
        { id: 2, title: t('marketFundamentals'), duration: '45m', completed: true },
        { id: 3, title: t('riskManagementBasics'), duration: '1h', completed: false },
        { id: 4, title: t('technicalAnalysisIntro'), duration: '1h 15m', completed: false },
      ]
    },
    {
      id: 2,
      title: t('technicalAnalysis'),
      subtitle: t('advancedChartPatterns'),
      level: 'Intermediate',
      duration: '12h',
      lessons: 36,
      icon: BarChart3,
      description: t('technicalCourseDesc'),
      modules: [
        { id: 1, title: t('candlestickPatterns'), duration: '1h', completed: false },
        { id: 2, title: t('supportResistance'), duration: '1h 30m', completed: false },
        { id: 3, title: t('indicatorsAndOscillators'), duration: '2h', completed: false },
        { id: 4, title: t('advancedChartFormations'), duration: '1h 45m', completed: false },
      ]
    },
    {
      id: 3,
      title: t('riskManagement'),
      subtitle: t('protectYourCapital'),
      level: 'Advanced',
      duration: '10h',
      lessons: 30,
      icon: Target,
      description: t('riskCourseDesc'),
      modules: [
        { id: 1, title: t('positionSizing'), duration: '1h 15m', completed: false },
        { id: 2, title: t('stopLossStrategies'), duration: '1h', completed: false },
        { id: 3, title: t('portfolioDiversification'), duration: '1h 30m', completed: false },
        { id: 4, title: t('drawdownControl'), duration: '1h 45m', completed: false },
      ]
    },
    {
      id: 4,
      title: t('aiTradingStrategies'),
      subtitle: t('algorithmicApproaches'),
      level: 'Expert',
      duration: '15h',
      lessons: 45,
      icon: Award,
      description: t('aiCourseDesc'),
      modules: [
        { id: 1, title: t('machineLearningBasics'), duration: '2h', completed: false },
        { id: 2, title: t('algorithmicStrategyDesign'), duration: '2h 30m', completed: false },
        { id: 3, title: t('backtestingMethods'), duration: '2h', completed: false },
        { id: 4, title: t('automatedTradingSystems'), duration: '2h 15m', completed: false },
      ]
    }
  ];

  const courses = React.useMemo(() => {
    return coursesData.map(course => ({
      ...course,
      modules: course.modules.map(module => ({
        ...module,
        completed: module.completed || completedModules.has(`${course.id}-${module.id}`)
      }))
    }));
  }, [coursesData, completedModules]);

  const progress = React.useMemo(() => {
    const prog: {[key: number]: number} = {};
    courses.forEach(course => {
      const completedCount = course.modules.filter(m => m.completed).length;
      prog[course.id] = (completedCount / course.modules.length) * 100;
    });
    return prog;
  }, [courses]);

  const achievements = [
    { id: 1, title: t('firstLessonCompleted'), icon: Star, earned: true },
    { id: 2, title: t('beginnerCertificate'), icon: Award, earned: true },
    { id: 3, title: t('intermediateLevel'), icon: Trophy, earned: false },
    { id: 4, title: t('aiTradingExpert'), icon: Award, earned: false },
  ];

  const upcomingWebinars = [
    { id: 1, title: t('liveTradingSession'), date: '2024-01-15', time: '18:00', speaker: 'John Doe' },
    { id: 2, title: t('marketAnalysisWorkshop'), date: '2024-01-18', time: '19:30', speaker: 'Jane Smith' },
    { id: 3, title: t('aiTradingStrategiesDeepDive'), date: '2024-01-22', time: '20:00', speaker: 'Dr. Ahmed Khan' },
  ];

  const toggleModuleCompletion = (courseId: number, moduleId: number) => {
    const key = `${courseId}-${moduleId}`;
    setCompletedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      saveCompletedModules(newSet);
      return newSet;
    });
  };

  const getCourseById = (courseId: number) => {
    return courses.find(c => c.id === courseId);
  };

  const getNextModule = (courseId: number, moduleId: number) => {
    const course = getCourseById(courseId);
    if (!course) return null;
    const modules = course.modules;
    const currentIndex = modules.findIndex(m => m.id === moduleId);
    if (currentIndex === -1) return null;
    const remaining = modules.slice(currentIndex + 1);
    const nextIncomplete = remaining.find(m => !m.completed);
    if (nextIncomplete) return nextIncomplete;
    return remaining[0] || null;
  };

  const openFirstLesson = (courseId: number) => {
    const course = getCourseById(courseId);
    if (!course) return;
    const firstIncomplete = course.modules.find(m => !m.completed);
    const target = firstIncomplete || course.modules[0];
    if (!target) return;
    setSelectedCourse(courseId);
    setActiveLesson({ courseId, moduleId: target.id });
  };

  const LessonModal: React.FC = () => {
    if (!activeLesson) return null;
    const course = getCourseById(activeLesson.courseId);
    const module = course?.modules.find(m => m.id === activeLesson.moduleId);
    if (!course || !module) return null;

    const handleCompleteAndNext = () => {
      toggleModuleCompletion(course.id, module.id);
      const nextModule = getNextModule(course.id, module.id);
      if (nextModule) {
        setActiveLesson({ courseId: course.id, moduleId: nextModule.id });
      } else {
        setActiveLesson(null);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-slate-900 rounded-2xl max-w-2xl w-full mx-4 p-6 border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{t('lessonViewerTitle')}</h2>
            <button
              onClick={() => setActiveLesson(null)}
              className="text-slate-400 hover:text-white text-2xl leading-none px-2"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            {course.title} • {module.title} • {module.duration}
          </p>
          <div className="bg-slate-800/70 rounded-xl p-4 mb-6">
            <p className="text-slate-200">
              {t('lessonContentPlaceholder', { title: module.title })}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setActiveLesson(null)}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 text-sm"
            >
              {t('closeLesson')}
            </button>
            <button
              onClick={handleCompleteAndNext}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium text-sm hover:opacity-90"
            >
              {t('markLessonCompleted')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CourseCard: React.FC<{ course: typeof courses[0] }> = ({ course }) => {
    const IconComponent = course.icon;
    const courseProgress = progress[course.id] || 0;

    return (
      <div 
        className={`modern-card p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
          selectedCourse === course.id ? 'ring-2 ring-emerald-500 bg-gradient-to-r from-emerald-500/10 to-blue-500/10' : ''
        }`}
        onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl">
              <IconComponent className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-slate-400 text-sm">{course.subtitle}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs px-2 py-1 bg-slate-700 rounded-full">{course.level}</span>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <BookOpen className="h-3 w-3" />
                  {course.lessons} {t('lessons')}
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400">{Math.round(courseProgress)}%</div>
            <div className="text-xs text-slate-400">{t('completed')}</div>
          </div>
        </div>
        
        {selectedCourse === course.id && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-300 mb-4">{course.description}</p>
            
            <div className="space-y-3">
              {course.modules.map(module => (
                <div 
                  key={module.id} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    module.completed 
                      ? 'bg-emerald-500/10 border border-emerald-500/20' 
                      : 'bg-slate-700/30 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModuleCompletion(course.id, module.id);
                      }}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        module.completed 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-slate-500'
                      }`}
                    >
                      {module.completed && <Play className="h-3 w-3 text-white" />}
                    </button>
                    <div>
                      <div className="font-medium">{module.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {module.duration}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    module.completed 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-600/30 text-slate-400'
                  }`}>
                    {module.completed ? t('completed') : t('notStarted')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700">
              <button
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  openFirstLesson(course.id);
                }}
              >
                {t('continueLearning')}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <LessonModal />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('masterClassAcademy')}</h1>
        <p className="text-slate-400">{t('masterClassSubtitle')}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="modern-card p-6 text-center">
          <div className="inline-flex p-3 bg-emerald-500/10 rounded-xl mb-3">
            <BookOpen className="h-6 w-6 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold">24+</div>
          <div className="text-slate-400 text-sm">{t('courses')}</div>
        </div>
        
        <div className="modern-card p-6 text-center">
          <div className="inline-flex p-3 bg-blue-500/10 rounded-xl mb-3">
            <Users className="h-6 w-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold">120k+</div>
          <div className="text-slate-400 text-sm">{t('students')}</div>
        </div>
        
        <div className="modern-card p-6 text-center">
          <div className="inline-flex p-3 bg-purple-500/10 rounded-xl mb-3">
            <Trophy className="h-6 w-6 text-purple-400" />
          </div>
          <div className="text-2xl font-bold">98%</div>
          <div className="text-slate-400 text-sm">{t('successRate')}</div>
        </div>
        
        <div className="modern-card p-6 text-center">
          <div className="inline-flex p-3 bg-amber-500/10 rounded-xl mb-3">
            <Star className="h-6 w-6 text-amber-400" />
          </div>
          <div className="text-2xl font-bold">4.9</div>
          <div className="text-slate-400 text-sm">{t('rating')}</div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-emerald-400" />
          {t('featuredCourses')}
        </h2>
        <div className="space-y-4">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Two-column layout for additional sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-400" />
            {t('achievements')}
          </h2>
          <div className="modern-card p-6">
            <div className="space-y-4">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    achievement.earned 
                      ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20' 
                      : 'bg-slate-700/30'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    achievement.earned ? 'bg-amber-500/20' : 'bg-slate-600/30'
                  }`}>
                    <achievement.icon className={`h-5 w-5 ${
                      achievement.earned ? 'text-amber-400' : 'text-slate-500'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{achievement.title}</div>
                    <div className={`text-sm ${
                      achievement.earned ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      {achievement.earned ? t('achieved') : t('locked')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Webinars */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-400" />
            {t('upcomingWebinars')}
          </h2>
          <div className="modern-card p-6">
            <div className="space-y-4">
              {upcomingWebinars.map(webinar => (
                <div key={webinar.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div>
                    <div className="font-medium">{webinar.title}</div>
                    <div className="text-sm text-slate-400">
                      {webinar.date} at {webinar.time} • {webinar.speaker}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    {t('register')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterClassAcademy;
