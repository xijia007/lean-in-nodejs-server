const admin = require('firebase-admin');

const jobController = (db) => {
    const getAllJobs = async (req, res) => {
        try {
            const jobs = await db.collection('jobs').get();
            const jobsJson = [];
            jobs.forEach((job) => {
                jobsJson.push({
                    id: job.job_id,
                    ...job.data(),
                });
            });
            res.send(jobsJson);
        } catch (error) {
            res.send(error);
        }
    };

    const createJob = async (req, res) => {
        try {
            const {
                job_id,
                company,
                title,
                company_name,
                location,
                description,
                apply,
            } = req.body;

            let companyId;

            //Find the company id if exist.
            await db
                .collection('companies')
                .where('name', '==', company)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        companyId = doc.id;
                    });
                });

            //If company id does not exist, create a new company.
            // if (!companyId) {
            // }
            const companyRef = db.collection('companies').doc(companyId);

            let jobsJson = {
                job_id,
                title,
                apply,
                company_name,
                location,
                company: companyRef,
                description,
                post_time: admin.firestore.Timestamp.fromDate(new Date()),
            };

            jobsJson = JSON.parse(JSON.stringify(jobsJson));
            // console.log(jobsJson);
            const response = await db.collection('jobs').add(jobsJson);
            // res.send({ ok: true });
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    };

    const getJob = async (req, res) => {
        try {
            const { id } = req.params;
            const job = await db.collection('jobs').doc(id).get();
            res.send(job.data());
        } catch (error) {
            res.send(error);
        }
    };

    const searchJob = async (req, res) => {
        const { keyword } = req.params;

        console.log(keyword);

        db.collection('jobs')
            .where('title', '>=', keyword)
            .where('title', '<=', keyword + '\uf8ff')
            .limit(10)
            .get()
            .then((querySnapshot) => {
                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push(doc.data());
                });
                res.send(data);
            })
            .catch((error) => {
                console.log(error);
                res.sendStatus(500);
            });
    };

    return {
        getAllJobs,
        createJob,
        getJob,
        searchJob,
        // updateJob,
        // deleteJob,
    };
};

module.exports = jobController;
