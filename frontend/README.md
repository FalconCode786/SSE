# Smart LMS & Admission Portal - Frontend

A React Native mobile application for Smart Learning Management System and Admission Portal, built with Expo, TypeScript, and NativeWind.

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/          # Application screens
│   ├── services/         # API and utility services
│   ├── theme/            # Design system and theme
│   ├── types/            # TypeScript interfaces
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   └── __tests__/        # Unit tests
├── App.tsx               # Main app entry point
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## Features

### Authentication
- **Login Screen**: Email-based authentication with role selection
- **Role-based Access**: Prospective Student, Enrolled Student, Faculty, Admin
- **Token Management**: JWT-based authentication with secure storage

### Student Features
- **Dashboard**: Real-time statistics, schedule, and alerts
- **Admission Portal**: Application form with eligibility checking and OCR support
- **Attendance**: QR code scanning and geofence-based marking
- **Chatbot**: AI-powered course assistance

### Faculty/Admin Features
- **Analytics**: Student performance analysis and risk scoring
- **At-Risk Alerts**: Identify and alert for at-risk students
- **Mass Communication**: Send alerts to students

## Design System

### Colors
- **Primary Navy**: #07162E - #1A3A70
- **Accent Red**: #8B0D1F - #F16474
- **Neutrals**: White, Gray scales

### Typography
- **Scales**: Hero, H1-H5, Body, BodySmall, Caption
- **Weights**: 400 (Regular), 600 (Semibold), 700 (Bold)

### Spacing
- 8-tier system: 4px to 48px

### Animations
- Smooth transitions (150-1000ms)
- Staggered reveals
- Scale animations on interactions

## Key Components

### Layout Components
- `GradientBackground`: Themed gradient wrapper
- `GlassCard`: Frosted glass effect card
- `AnimatedReveal`: Staggered animation wrapper

### Form Components
- `Input`: Validated text input with icons
- `Button`: Multi-variant action button
- `Badge`: Status indicator

### Feedback Components
- `Alert`: Error/success/warning messages
- `Loading`: Spinner indicator
- `SectionHeader`: Section titles

### Data Components
- `StatsCard`: Metric display with trends
- `Divider`: Visual separator

## Screens

### LoginScreen
- Email validation
- Role selection (4 roles)
- Remember me option
- Error handling

### DashboardScreen
- Attendance percentage with trend indicator
- Pending assignments count
- Today's schedule
- Dismissible alerts
- Pull-to-refresh functionality

### AdmissionScreen
- Tab navigation (Application / Status)
- Form with validation for 5 fields
- Program selection (4 options)
- OCR document scanner
- Eligibility checking
- Application status tracking

### AttendanceScreen
- QR code scanning
- Geofence verification
- Attendance history
- Statistics display
- Location permission handling

### ChatbotScreen
- Course selector
- Message history with timestamps
- Character counter (500 limit)
- Suggested questions
- Real-time AI responses

### AdminScreen
- Tab navigation (Analytics / Alerts)
- Student analysis form
- Risk score visualization
- At-risk students list
- Quick actions (Send Alert, Generate Report)

## Services

### API Service (`src/services/api.ts`)
- Login/authentication
- Dashboard data fetching
- Eligibility checking
- Attendance marking
- Chatbot interaction
- Predictive alerts

### Error Handler (`src/services/errorHandler.ts`)
- Error classification
- User-friendly messages
- Retry logic with exponential backoff
- Error logging

### Validation (`src/services/validation.ts`)
- Email validation
- CNIC validation
- Password strength checking
- Form batch validation
- Input sanitization

## Error Handling

### ErrorBoundary Component
- Catches React errors
- Displays user-friendly messages
- Development error details (DEV only)
- Retry functionality

### API Errors
- Network error detection
- Timeout handling
- Automatic retry for transient failures
- Proper error classification

### Form Validation
- Real-time validation feedback
- Specific error messages
- Input sanitization for XSS prevention

## Testing

### Frontend Tests
- Component rendering tests
- User interaction tests
- Form validation tests
- API integration tests
- Error boundary tests

### Running Tests
```bash
npm test
```

### Test Coverage
- Components: Button, Input, ErrorBoundary
- Screens: LoginScreen, DashboardScreen, AdmissionScreen, AttendanceScreen, ChatbotScreen, AdminScreen
- Services: API integration, validation

## Development

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm start
# or
expo start
```

### Build for iOS
```bash
eas build --platform ios
```

### Build for Android
```bash
eas build --platform android
```

## Code Quality

### Formatting
- Prettier for consistent formatting
- ESLint for code quality

### Type Safety
- Full TypeScript implementation
- Strict type checking enabled

### Documentation
- JSDoc comments on all functions
- Inline documentation for complex logic

## Performance Optimization

### Optimization Strategies
- Component memoization with React.memo
- Lazy loading of screens
- Image optimization
- Efficient list rendering
- API response caching

### App Load Time Target
- < 2 seconds (per PRD requirements)

## Security

### Authentication
- JWT token-based authentication
- Secure token storage
- Session management
- Auto-logout on token expiration

### Data Protection
- Input validation and sanitization
- XSS prevention
- HTTPS for all API calls
- Secure error messages (no sensitive info leak)

## Debugging

### Debugging Tips
- Use React DevTools
- Console logging in development
- Network inspection in Expo
- Use Redux DevTools for state management

### Common Issues

**Issue: App won't start**
- Clear cache: `expo start --clear`
- Delete node_modules and reinstall
- Check for TypeScript errors

**Issue: API calls failing**
- Check network connection
- Verify token is valid
- Check API endpoint URLs
- Review error messages in console

**Issue: Styling not applied**
- Clear Tailwind cache
- Rebuild Tailwind CSS
- Check theme token references

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow naming conventions
- Add JSDoc comments
- Write tests for new features

### Commit Messages
- Use descriptive messages
- Reference issue numbers
- Keep commits atomic

## Deployment

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] API endpoints verified
- [ ] Error handling in place

### Production Build
```bash
eas build --platform all --auto-submit
```

## Support

For issues or questions:
1. Check the logs for error details
2. Review test files for usage examples
3. Consult component documentation
4. Contact development team

## License

Proprietary - Smart LMS & Admission Portal
