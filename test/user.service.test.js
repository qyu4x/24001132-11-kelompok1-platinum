const userRepository = require('../src/repository/user.repository');
const userService = require('../src/service/user.service');

const uuid = require('uuid');
const {sendEmail} = require("../src/helper/send-email.helper");
const {generateOtp} = require('../src/helper/generate-otp');
const {renderHtml} = require("../src/helper/render-html.helper");

jest.mock('../src/repository/user.repository');
jest.mock('../src/helper/generate-otp');
jest.mock('../src/helper/send-email.helper');
jest.mock('../src/helper/render-html.helper');
jest.mock('uuid');


describe('register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user and send verification email', async () => {

        const mockRequest = {
            username: 'testuser',
            full_name: 'Test User',
            email: 'testuser@example.com',
            password: 'testpassword',
            birth_date: '2002-08-08'
        };

        const mockUuid = 'random-uuid-v4';
        const htmlTemplate = '<html><h1>render some html value</h1>></html>>';

        const mockCreatedUser = {id: mockUuid, ...mockRequest};

        uuid.v4.mockReturnValue(mockUuid);
        generateOtp.mockResolvedValue('76543');
        renderHtml.mockResolvedValue(htmlTemplate);
        sendEmail.mockResolvedValue('email sent');

        userRepository.findOneByUsername.mockResolvedValue(null);
        userRepository.findOneByEmail.mockResolvedValue(null);

        userRepository.create.mockResolvedValue(mockCreatedUser);
        userRepository.findOneInactiveById.mockResolvedValue(mockCreatedUser);

        const registerResult = await userService.register(mockRequest);

        expect(registerResult).toEqual(mockCreatedUser);

        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(userRepository.create).toHaveBeenCalledTimes(1);
        expect(userRepository.findOneInactiveById).toHaveBeenCalledTimes(1);

        expect(renderHtml).toHaveBeenCalledWith("otp.ejs", {name: "Test User", otp: "76543"});

        expect(sendEmail).toHaveBeenCalledWith(
            'testuser@example.com',
            'Verify Your Account with This OTP Code (Valid for 5 Minutes)',
            htmlTemplate
        );
        expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining(
            {
                username: 'testuser',
                full_name: 'Test User',
                email: 'testuser@example.com',
            }
        ));
    });

    it('must fail to register a new user because the username already registered', async () => {

        const mockRequest = {
            username: 'testuser',
            full_name: 'Test User',
            email: 'testuser@example.com',
            password: 'testpassword',
            birth_date: '2002-08-08'
        };

        const mockUuid = 'random-uuid-v4';

        uuid.v4.mockReturnValue(mockUuid);

        userRepository.findOneByUsername.mockResolvedValue({id: mockUuid});
        userRepository.findOneByEmail.mockResolvedValue(null);


        await expect(userService.register(mockRequest)).rejects.toThrow('Username already registered');

        expect(sendEmail).toHaveBeenCalledTimes(0);
        expect(userRepository.create).toHaveBeenCalledTimes(0);
        expect(userRepository.findOneInactiveById).toHaveBeenCalledTimes(0);

        expect(renderHtml).toHaveBeenCalledTimes(0);
        expect(sendEmail).toHaveBeenCalledTimes(0)
        expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    it('must fail to register a new user because the email already registered', async () => {

        const mockRequest = {
            username: 'testuser',
            full_name: 'Test User',
            email: 'testuser@example.com',
            password: 'testpassword',
            birth_date: '2002-08-08'
        };

        const mockUuid = 'random-uuid-v4';

        uuid.v4.mockReturnValue(mockUuid);

        userRepository.findOneByUsername.mockResolvedValue(null);
        userRepository.findOneByEmail.mockResolvedValue({id: mockUuid});


        await expect(userService.register(mockRequest)).rejects.toThrow('Email already registered');

        expect(sendEmail).toHaveBeenCalledTimes(0);
        expect(userRepository.create).toHaveBeenCalledTimes(0);
        expect(userRepository.findOneInactiveById).toHaveBeenCalledTimes(0);

        expect(renderHtml).toHaveBeenCalledTimes(0);
        expect(sendEmail).toHaveBeenCalledTimes(0)
        expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

})