const {prisma} = require('../db/prisma');
const {createUserDto, updateUserDto} = require('../dto/user.dto');
const {AppError} = require('../common/errors');

const LOCK_THRESHOLD = parseInt(process.env.LOGIN_FAIL_THRESHOLD || '5', 10);          // number of failed attempts before lock
const LOCK_DURATION_MS = parseInt(process.env.LOGIN_LOCK_DURATION_MS || '3600000', 10); // lock duration (default 1 hour)

const createUser = async (attributes) => {
    const parsed = createUserDto.parse(attributes);
    const exists = await prisma.user.findUnique({where: {email: parsed.email}});
    if (exists) throw new AppError(409, 'User already exists');

    return await prisma.user.create({
        data: {
            email: parsed.email,
            phone: parsed.phone,
            firstName: parsed.firstName,
            lastName: parsed.lastName,
            role: 'client'
        }
    });
};

const updateUser = async (userId, attributes) => {
    // Validate structure (Zod allows optional fields)
    const parsed = updateUserDto.parse(attributes);

    //  Keep only provided (non-undefined) fields
    const data = Object.fromEntries(
        Object.entries(parsed).filter(([_, v]) => v !== undefined)
    );
    // Check if email is already used by another user
    if (data.email) {
        const existing = await prisma.user.findUnique({
            where: {email: data.email},
        });

        if (existing && existing.id !== userId) {
            throw new AppError(409, 'Email already exists');
        }
    }
    try {
        //  Perform the update
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data,
        });

        return updatedUser;
    } catch (err) {
        //Handle specific Prisma errors
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw new AppError(404, 'User not found');
            }
        }
        throw err;
    }
};

const getUser = async (userId) => {
    const u = await prisma.user.findUnique({where: {id: userId}});
    if (!u) throw new AppError(404, 'User not found');
    return u;
};

const getAllUsers = async () => prisma.user.findMany();

const recordLogin = async (userId, success) => {
    if (success) {
        // ✅ Successful login — reset counters and unlock if needed
        return prisma.user.update({
            where: {id: userId},
            data: {
                lastLoginAt: new Date(),
                loginFailures: 0,
                status: 'active',
                lockUntil: null
            }
        });
    }

    // ❌ Failed login — increment failure counter
    const u = await getUser(userId);
    const lf = (u.loginFailures || 0) + 1;

    // 🔒 If exceeded threshold, lock account for duration
    if (lf >= LOCK_THRESHOLD) {
        const until = new Date(Date.now() + LOCK_DURATION_MS);
        return prisma.user.update({
            where: {id: userId},
            data: {
                loginFailures: lf,
                status: 'locked',
                lockUntil: until
            }
        });
    }

    // Otherwise, just record the failed attempt
    return prisma.user.update({
        where: {id: userId},
        data: {loginFailures: lf}
    });
};

const getUserByEmail = async (email) => {
    const normEmail = email.toLowerCase();
    return await prisma.user.findUnique({
        where: {email: normEmail},
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            status: true,
            role: true,
            lockUntil: true,
            loginFailures: true
        }
    });
};

const findByPhone = async (phone) => {
    return prisma.user.findFirst({
      where: {
        phone,
        status: "active",
      },
      select: {
        id: true,
        role: true,
        phone: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  };

module.exports = { createUser, updateUser, getUser, getAllUsers, recordLogin, getUserByEmail,findByPhone };
