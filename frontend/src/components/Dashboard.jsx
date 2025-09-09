import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mic, MessageCircle, BarChart3, User, LogOut, Menu, X } from 'lucide-react';

const Dashboard = ({ user, onLogout, children, isAnonymous = false, onAuthRequired }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navigation = isAnonymous ? [
        { name: 'Home', href: '/', icon: Mic },
    ] : [
        { name: 'Home', href: '/', icon: Mic },
        { name: 'Questions', href: '/questions', icon: MessageCircle },
        { name: 'Feedback', href: '/recordings', icon: BarChart3 },
        { name: 'Practice', href: '/practice', icon: Mic },
        { name: 'Generate', href: '/generate', icon: MessageCircle },
    ];

    const handleLogout = () => {
        onLogout();
        setIsMobileMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-md bg-white shadow-lg text-gray-600 hover:text-gray-900"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center px-6 py-4 border-b border-slate-200">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Mic className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="ml-3 text-xl font-bold text-slate-900">InterviewReady AI</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="px-4 py-4 border-t border-slate-200">
                        {isAnonymous ? (
                            <div className="text-center">
                                <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="w-5 h-5 text-slate-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-900 mb-2">Guest User</p>
                                <p className="text-xs text-slate-500 mb-4">Try our free trial</p>
                                <button
                                    onClick={onAuthRequired}
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                                >
                                    Sign In
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-slate-900">{user?.username || 'User'}</p>
                                        <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="lg:pl-64">
                <main className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;